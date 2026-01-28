const axios = require('axios');
const { User, Sprint, UserStory } = require('../models');
const logger = require('../utils/logger');

class JiraSyncService {
  constructor(project) {
    this.project = project;
    this.client = null;
  }

  async initialize() {
    if (!this.project.jiraServerUrl || !this.project.jiraUsername || !this.project.jiraApiToken) {
      throw new Error('Jira configuration incomplete');
    }
    this.jiraAuth = {
      username: this.project.jiraUsername,
      password: this.project.jiraApiToken
    };
    this.baseUrl = this.project.jiraServerUrl;
  }

  getStoryPointsField() {
    return this.project.jiraConfig?.storyPointsField || 'customfield_10016';
  }

  async jiraRequest(endpoint, options = {}) {
    try {
      const config = {
        method: options.method || 'GET',
        url: `${this.baseUrl}/rest/api/2${endpoint}`,
        auth: this.jiraAuth,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        timeout: 30000,
        ...options
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`Jira API error: ${error.response?.data?.errorMessages?.[0] || error.message}`);
    }
  }

  async agileRequest(endpoint, options = {}) {
    try {
      const config = {
        method: options.method || 'GET',
        url: `${this.baseUrl}/rest/agile/1.0${endpoint}`,
        auth: this.jiraAuth,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        timeout: 30000,
        ...options
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`Jira Agile API error: ${error.response?.data?.errorMessages?.[0] || error.message}`);
    }
  }

  async syncSprints() {
    logger.info(`Starting sprint sync for project ${this.project.name}`);
    const boardsResp = await this.agileRequest(`/board?projectKeyOrId=${this.project.jiraProjectKey}`);
    const boards = boardsResp.values || [];
    if (boards.length === 0) throw new Error(`No agile boards found for project ${this.project.jiraProjectKey}`);

    let syncedCount = 0;
    const errors = [];

    for (const board of boards) {
      try {
        const sprintsResponse = await this.agileRequest(`/board/${board.id}/sprint?state=active,closed,future`);
        for (const jiraSprint of sprintsResponse.values || []) {
          try {
            const sprintData = {
              jiraSprintId: jiraSprint.id.toString(),
              name: jiraSprint.name,
              goal: jiraSprint.goal || '',
              state: jiraSprint.state?.toLowerCase() || 'future',
              startDate: jiraSprint.startDate ? new Date(jiraSprint.startDate) : null,
              endDate: jiraSprint.endDate ? new Date(jiraSprint.endDate) : null,
              completeDate: jiraSprint.completeDate ? new Date(jiraSprint.completeDate) : null,
              projectId: this.project.id,
              status: this.mapSprintStatus(jiraSprint.state)
            };

            if (!sprintData.startDate || !sprintData.endDate) continue;

            let sprint = await Sprint.findOne({ where: { jiraSprintId: sprintData.jiraSprintId, projectId: this.project.id } });
            if (sprint) {
              await sprint.update(sprintData);
            } else {
              await Sprint.create(sprintData);
            }
            syncedCount++;
          } catch (sprintError) {
            errors.push(`${jiraSprint.name}: ${sprintError.message}`);
          }
        }
      } catch (boardError) {
        errors.push(`Board ${board.name}: ${boardError.message}`);
      }
    }

    return { success: true, syncedCount, errors };
  }

  async syncUserStories(sprintId = null) {
    const storyPointsField = this.getStoryPointsField();
    let sprints = [];
    if (sprintId) {
      const sprint = await Sprint.findByPk(sprintId);
      if (sprint) sprints = [sprint];
    } else {
      sprints = await Sprint.findAll({ where: { projectId: this.project.id } });
    }

    let syncedCount = 0;
    const errors = [];

    for (const sprint of sprints) {
      try {
        const issuesResponse = await this.jiraRequest(`/search?jql=sprint=${sprint.jiraSprintId}&maxResults=1000`);
        for (const issue of issuesResponse.issues || []) {
          try {
            if (!issue.fields.issuetype?.name) continue;

            let assigneeId = null;
            if (issue.fields.assignee) {
              const accountId = issue.fields.assignee.accountId;
              const email = issue.fields.assignee.emailAddress?.toLowerCase();
              let assignee = null;
              if (accountId) assignee = await User.findOne({ where: { jiraAccountId: accountId } });
              if (!assignee && email) assignee = await User.findOne({ where: { email } });
              assigneeId = assignee?.id || null;
            }

            const rawPoints = issue.fields[storyPointsField];
            const storyData = {
              jiraId: issue.id,
              jiraKey: issue.key,
              title: issue.fields.summary,
              description: issue.fields.description || '',
              storyType: issue.fields.issuetype.name.toLowerCase(),
              status: this.mapStoryStatus(issue.fields.status.name),
              priority: this.mapStoryPriority(issue.fields.priority?.name || 'Medium'),
              storyPoints: rawPoints != null ? Number(rawPoints) : null,
              assigneeId,
              sprintId: sprint.id,
              projectId: this.project.id
            };

            const existing = await UserStory.findOne({ where: { jiraId: issue.id, projectId: this.project.id } });
            if (existing) {
              await existing.update(storyData);
            } else {
              await UserStory.create(storyData);
            }
            syncedCount++;
          } catch (storyError) {
            errors.push(`${issue.key}: ${storyError.message}`);
          }
        }
      } catch (sprintError) {
        errors.push(`Sprint ${sprint.name}: ${sprintError.message}`);
      }
    }

    return { success: true, syncedCount, errors };
  }

  async fullSync() {
    logger.info(`Starting full Jira sync for project ${this.project.name}`);
    const results = { sprints: null, userStories: null, startTime: new Date(), endTime: null, success: false };

    results.sprints = await this.syncSprints();
    results.userStories = await this.syncUserStories();

    results.endTime = new Date();
    results.success = results.sprints.success && results.userStories.success;

    await this.project.update({
      jiraConfig: { ...this.project.jiraConfig, lastSync: results.endTime }
    });

    return results;
  }

  mapSprintStatus(jiraState) {
    if (!jiraState) return 'planning';
    const s = jiraState.toLowerCase();
    if (s === 'active') return 'active';
    if (s === 'closed') return 'completed';
    return 'planning';
  }

  mapStoryStatus(name) {
    if (!name) return 'To Do';
    const s = name.toLowerCase();
    if (['done', 'closed', 'resolved', 'completed', 'canceled', 'cancelled'].some(k => s.includes(k))) return 'Done';
    if (['in progress', 'doing', 'review', 'testing', 'qa', 'blocked'].some(k => s.includes(k))) return 'In Progress';
    return 'To Do';
  }

  mapStoryPriority(name) {
    if (!name) return 'Medium';
    const p = name.toLowerCase();
    if (['critical', 'blocker'].some(k => p.includes(k))) return 'Critical';
    if (p.includes('high')) return 'High';
    if (p.includes('low')) return 'Low';
    return 'Medium';
  }
}

module.exports = JiraSyncService;
