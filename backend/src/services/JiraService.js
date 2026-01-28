const axios = require('axios');
const { User, Sprint, UserStory, Project, ProjectUser } = require('../models');
const logger = require('../utils/logger');

class JiraService {
  constructor(project) {
    this.project = project;
    this.client = null;
    this.setupClient();
  }

  setupClient() {
    if (!this.project.jiraServerUrl || !this.project.jiraUsername || !this.project.jiraApiToken) {
      throw new Error('Jira configuration incomplete for this project');
    }

    const auth = Buffer.from(`${this.project.jiraUsername}:${this.project.jiraApiToken}`).toString('base64');

    this.client = axios.create({
      baseURL: this.project.jiraServerUrl,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async testConnection() {
    try {
      const response = await this.client.get('/rest/api/2/serverInfo');
      try {
        await this.client.get('/rest/api/2/myself');
      } catch (authError) {
        if (authError.response?.status === 401) {
          throw new Error('Authentication failed. Please check your Jira username and API token.');
        }
      }
      return {
        success: true,
        serverInfo: {
          version: response.data.version,
          title: response.data.serverTitle,
          baseUrl: response.data.baseUrl
        }
      };
    } catch (error) {
      logger.error(`Jira connection failed for project ${this.project.name}:`, error.message);
      return { success: false, error: this.handleJiraError(error) };
    }
  }

  handleJiraError(error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return ['Unable to connect to Jira server. Check server URL.'];
    } else if (error.response?.status === 401) {
      return ['Authentication failed. Check username and API token.'];
    } else if (error.response?.status === 403) {
      return ['Permission denied. Check user permissions.'];
    } else if (error.response?.status === 404) {
      return ['Jira endpoint not found. Check server URL.'];
    }
    return [error.message || 'Unknown Jira connection error'];
  }

  async getProjectUsers() {
    try {
      try {
        const response = await this.client.get('/rest/api/3/user/assignable/search', {
          params: { project: this.project.jiraProjectKey, maxResults: 1000 }
        });
        return response.data || [];
      } catch {
        try {
          const response = await this.client.get('/rest/api/2/user/assignable/search', {
            params: { project: this.project.jiraProjectKey, maxResults: 1000 }
          });
          return response.data || [];
        } catch {
          const rolesResponse = await this.client.get(`/rest/api/2/project/${this.project.jiraProjectKey}/role`);
          const users = [];
          for (const [, roleUrl] of Object.entries(rolesResponse.data)) {
            try {
              const roleResponse = await this.client.get(roleUrl);
              if (roleResponse.data.actors) {
                roleResponse.data.actors.forEach(actor => {
                  if (actor.type === 'atlassian-user-role-actor' && actor.displayName) {
                    users.push({
                      accountId: actor.accountId || actor.name,
                      displayName: actor.displayName,
                      emailAddress: actor.emailAddress || null
                    });
                  }
                });
              }
            } catch { /* skip role */ }
          }
          return users.filter((user, i, self) => i === self.findIndex(u => u.accountId === user.accountId));
        }
      }
    } catch (error) {
      throw new Error(`Failed to fetch users from Jira: ${error.message}`);
    }
  }

  async importUsers() {
    logger.info(`Starting user import for project ${this.project.name}`);
    const jiraUsers = await this.getProjectUsers();
    const results = { created: [], updated: [], addedToProject: [], errors: [] };

    for (const jiraUser of jiraUsers) {
      try {
        if (!jiraUser.displayName) continue;
        const email = jiraUser.emailAddress
          ? jiraUser.emailAddress.toLowerCase()
          : `${jiraUser.accountId}@jira.placeholder`;
        const [firstName, ...lastNameParts] = jiraUser.displayName.split(' ');
        const lastName = lastNameParts.join(' ') || firstName;

        // Try to find by jiraAccountId first, then by email
        let user = await User.findOne({ where: { jiraAccountId: jiraUser.accountId } });
        if (!user) {
          user = await User.findOne({ where: { email } });
        }

        if (user) {
          await user.update({ jiraAccountId: jiraUser.accountId, jiraDisplayName: jiraUser.displayName });
          results.updated.push({ email, name: jiraUser.displayName });
        } else {
          user = await User.create({
            email,
            firstName,
            lastName,
            entraId: `jira-${jiraUser.accountId}`,
            jiraAccountId: jiraUser.accountId,
            jiraDisplayName: jiraUser.displayName,
            role: 'member'
          });
          results.created.push({ email, name: jiraUser.displayName });
          logger.info(`Created user from Jira: ${jiraUser.displayName} (${email})`);
        }

        const existingMembership = await ProjectUser.findOne({
          where: { projectId: this.project.id, userId: user.id }
        });
        if (!existingMembership) {
          await ProjectUser.create({ projectId: this.project.id, userId: user.id, role: 'member' });
          results.addedToProject.push({ email, name: jiraUser.displayName });
        }
      } catch (userError) {
        logger.error(`Error syncing user ${jiraUser.displayName}:`, userError.message);
        results.errors.push(`${jiraUser.displayName}: ${userError.message}`);
      }
    }

    await this.project.update({
      jiraConfig: { ...this.project.jiraConfig, lastSync: new Date(), isConnected: true }
    });

    return results;
  }

  async importSprints() {
    logger.info(`Starting sprint import for project ${this.project.name}`);
    let boardsResponse;

    try {
      boardsResponse = await this.client.get('/rest/agile/1.0/board', {
        params: { projectKeyOrId: this.project.jiraProjectKey }
      });
    } catch {
      try {
        const allBoardsResponse = await this.client.get('/rest/agile/1.0/board', { params: { maxResults: 100 } });
        const projectBoards = (allBoardsResponse.data.values || []).filter(board =>
          board.location?.projectKey === this.project.jiraProjectKey
        );
        boardsResponse = { data: { values: projectBoards } };
      } catch (error) {
        throw new Error(`Failed to fetch boards for project ${this.project.jiraProjectKey}: ${error.message}`);
      }
    }

    const boards = boardsResponse.data.values || [];
    if (boards.length === 0) {
      return { created: [], updated: [], errors: [`No agile boards found for project ${this.project.jiraProjectKey}`] };
    }

    const results = { created: [], updated: [], errors: [] };
    const boardId = this.project.jiraBoardId || boards[0].id;

    const sprintsResponse = await this.client.get(`/rest/agile/1.0/board/${boardId}/sprint`, {
      params: { maxResults: 100 }
    });

    for (const jiraSprint of sprintsResponse.data.values || []) {
      try {
        const sprintData = {
          name: jiraSprint.name,
          startDate: jiraSprint.startDate || null,
          endDate: jiraSprint.endDate || null,
          goal: jiraSprint.goal || null,
          state: this.mapSprintStatus(jiraSprint.state),
          status: this.mapSprintStatus(jiraSprint.state),
          jiraSprintId: String(jiraSprint.id),
          completeDate: jiraSprint.completeDate || null,
          projectId: this.project.id
        };

        const [sprint, created] = await Sprint.findOrCreate({
          where: { jiraSprintId: String(jiraSprint.id), projectId: this.project.id },
          defaults: sprintData
        });

        if (created) {
          results.created.push({ name: sprint.name, jiraId: sprint.jiraSprintId });
        } else {
          await sprint.update(sprintData);
          results.updated.push({ name: sprint.name, jiraId: sprint.jiraSprintId });
        }
      } catch (sprintError) {
        results.errors.push(`${jiraSprint.name}: ${sprintError.message}`);
      }
    }

    await this.project.update({
      jiraConfig: { ...this.project.jiraConfig, lastSync: new Date(), isConnected: true }
    });

    return results;
  }

  async importUserStories(sprintId) {
    const sprint = await Sprint.findOne({ where: { id: sprintId, projectId: this.project.id } });
    if (!sprint) throw new Error('Sprint not found');
    if (!sprint.jiraSprintId) throw new Error('Sprint has no Jira ID');

    const storyPointsField = this.project.jiraConfig?.storyPointsField || 'customfield_10016';
    const fields = `summary,description,status,priority,assignee,issuetype,${storyPointsField},updated`;

    const response = await this.client.get(`/rest/agile/1.0/sprint/${sprint.jiraSprintId}/issue`, {
      params: { maxResults: 1000, fields }
    });

    const results = { created: [], updated: [], errors: [] };
    const issues = response.data.issues || [];
    logger.info(`Sprint ${sprint.name}: fetched ${issues.length} issues from Jira`);

    for (const issue of issues) {
      try {
        let assigneeId = null;
        if (issue.fields.assignee) {
          // Look up by accountId first, then email
          const accountId = issue.fields.assignee.accountId;
          const email = issue.fields.assignee.emailAddress?.toLowerCase();
          let assignee = null;
          if (accountId) {
            assignee = await User.findOne({ where: { jiraAccountId: accountId } });
          }
          if (!assignee && email) {
            assignee = await User.findOne({ where: { email } });
          }
          assigneeId = assignee?.id || null;
        }

        const rawPoints = issue.fields[storyPointsField];
        const storyPoints = rawPoints != null ? Number(rawPoints) : null;

        const storyData = {
          title: issue.fields.summary,
          description: issue.fields.description || null,
          storyPoints,
          priority: this.mapPriority(issue.fields.priority?.name),
          status: this.mapStatus(issue.fields.status?.name),
          assigneeId,
          sprintId: sprint.id,
          projectId: this.project.id,
          jiraKey: issue.key,
          jiraId: issue.id
        };

        const [story, created] = await UserStory.findOrCreate({
          where: { jiraId: issue.id, projectId: this.project.id },
          defaults: storyData
        });

        if (created) {
          results.created.push({ key: story.jiraKey, title: story.title, storyPoints });
        } else {
          await story.update(storyData);
          results.updated.push({ key: story.jiraKey, title: story.title, storyPoints });
        }
      } catch (storyError) {
        results.errors.push(`${issue.key}: ${storyError.message}`);
      }
    }

    return results;
  }

  async importAllUserStories() {
    const results = { created: [], updated: [], errors: [] };
    const storyPointsField = this.project.jiraConfig?.storyPointsField || 'customfield_10016';
    const jql = `project = "${this.project.jiraProjectKey}" AND issuetype in (Story, Task, Bug, Epic)`;
    const fields = `summary,description,assignee,status,priority,issuetype,${storyPointsField},updated`;

    let response;
    try {
      response = await this.client.get('/rest/api/2/search', {
        params: { jql, maxResults: 1000, fields }
      });
    } catch (error) {
      throw new Error(`Failed to search Jira issues: ${error.message}`);
    }

    logger.info(`importAllUserStories: fetched ${(response.data.issues || []).length} issues`);

    for (const issue of response.data.issues || []) {
      try {
        const rawPoints = issue.fields[storyPointsField];

        const storyData = {
          title: issue.fields.summary,
          description: typeof issue.fields.description === 'string'
            ? issue.fields.description
            : issue.fields.description?.content
              ? issue.fields.description.content.map(c => c.content?.map(cc => cc.text).join(' ')).join('\n')
              : '',
          status: this.mapStatus(issue.fields.status?.name),
          priority: this.mapPriority(issue.fields.priority?.name),
          storyPoints: rawPoints != null ? Number(rawPoints) : null,
          storyType: issue.fields.issuetype?.name?.toLowerCase() || 'story',
          projectId: this.project.id,
          jiraKey: issue.key,
          jiraId: issue.id,
          sprintId: null
        };

        const existing = await UserStory.findOne({ where: { jiraKey: issue.key, projectId: this.project.id } });
        if (existing) {
          await existing.update(storyData);
          results.updated.push(issue.key);
        } else {
          await UserStory.create(storyData);
          results.created.push(issue.key);
        }
      } catch (storyError) {
        results.errors.push(`${issue.key}: ${storyError.message}`);
      }
    }

    return results;
  }

  async fullSync() {
    logger.info(`Starting full sync for project ${this.project.name}`);
    const connectionTest = await this.testConnection();
    if (!connectionTest.success) {
      throw new Error(`Jira connection failed: ${connectionTest.error.join(', ')}`);
    }

    const results = { users: null, sprints: null, stories: null, errors: [] };

    try { results.users = await this.importUsers(); }
    catch (error) { results.errors.push({ stage: 'users', error: error.message }); }

    try { results.sprints = await this.importSprints(); }
    catch (error) { results.errors.push({ stage: 'sprints', error: error.message }); }

    try {
      results.stories = { created: [], updated: [], errors: [] };
      const sprints = await Sprint.findAll({
        where: { projectId: this.project.id, jiraSprintId: { [require('sequelize').Op.ne]: null } },
        order: [['startDate', 'ASC']]
      });
      if (sprints.length > 0) {
        for (const sprint of sprints) {
          try {
            const r = await this.importUserStories(sprint.id);
            results.stories.created.push(...r.created);
            results.stories.updated.push(...r.updated);
            results.stories.errors.push(...r.errors);
          } catch (error) {
            results.stories.errors.push(`Sprint ${sprint.name}: ${error.message}`);
          }
        }
      } else {
        results.stories = await this.importAllUserStories();
      }
    } catch (error) {
      results.errors.push({ stage: 'stories', error: error.message });
    }

    await this.project.update({
      jiraConfig: { ...this.project.jiraConfig, lastFullSync: new Date(), lastSync: new Date(), isConnected: true }
    });

    return results;
  }

  mapSprintStatus(jiraState) {
    const map = { future: 'planning', active: 'active', closed: 'completed' };
    return map[jiraState?.toLowerCase()] || 'planning';
  }

  mapPriority(name) {
    if (!name) return 'Medium';
    const p = name.toLowerCase();
    if (p.includes('critical') || p.includes('blocker')) return 'Critical';
    if (p.includes('high') || p.includes('highest')) return 'High';
    if (p.includes('low') || p.includes('lowest')) return 'Low';
    return 'Medium';
  }

  mapStatus(name) {
    if (!name) return 'To Do';
    const s = name.toLowerCase();
    if (s.includes('done') || s.includes('closed') || s.includes('resolved') || s.includes('canceled') || s.includes('cancelled')) return 'Done';
    if (s.includes('progress') || s.includes('review') || s.includes('testing') || s.includes('blocked')) return 'In Progress';
    return 'To Do';
  }

  static async syncProject(projectId, options = {}) {
    const project = await Project.findByPk(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    if (!project.isActive) throw new Error(`Project is not active: ${project.name}`);
    if (!project.hasJiraConfig()) throw new Error(`Project has no Jira config: ${project.name}`);

    const jiraService = new JiraService(project);
    const { syncUsers = true, syncSprints = true, syncIssues = true } = options;
    const results = { projectId: project.id, projectName: project.name, timestamp: new Date() };

    if (syncUsers) {
      try { results.users = await jiraService.importUsers(); }
      catch (error) { results.usersError = error.message; }
    }
    if (syncSprints) {
      try { results.sprints = await jiraService.importSprints(); }
      catch (error) { results.sprintsError = error.message; }
    }
    if (syncIssues) {
      try { results.stories = await jiraService.importAllUserStories(); }
      catch (error) { results.storiesError = error.message; }
    }

    await project.update({
      jiraConfig: { ...project.jiraConfig, lastSync: new Date(), isConnected: true, lastSyncError: null }
    });

    return results;
  }
}

module.exports = JiraService;
