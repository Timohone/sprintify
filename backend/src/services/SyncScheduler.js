const cron = require('node-cron');
const logger = require('../utils/logger');
const { Project } = require('../models');
const JiraService = require('./JiraService');
const { Op } = require('sequelize');

class SyncScheduler {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  async start(options = {}) {
    const { schedule = '*/15 * * * *', syncOnStart = true } = options;
    if (this.isRunning) return;

    logger.info(`Starting Sync Scheduler with schedule: ${schedule}`);

    if (syncOnStart) {
      await this.syncAllProjects();
    }

    this.mainJob = cron.schedule(schedule, async () => {
      logger.info('Scheduled sync triggered');
      await this.syncAllProjects();
    });

    this.isRunning = true;
  }

  stop() {
    if (this.mainJob) {
      this.mainJob.stop();
      this.mainJob = null;
    }
    this.jobs.forEach(job => job.stop());
    this.jobs.clear();
    this.isRunning = false;
  }

  async syncAllProjects() {
    try {
      const projects = await Project.findAll({
        where: { isActive: true, jiraProjectKey: { [Op.ne]: null } }
      });

      if (projects.length === 0) return [];

      const results = [];
      for (const project of projects) {
        try {
          const result = await JiraService.syncProject(project.id);
          results.push({ projectId: project.id, projectName: project.name, success: true, ...result });
        } catch (error) {
          logger.error(`Error syncing project ${project.name}:`, error);
          results.push({ projectId: project.id, projectName: project.name, success: false, error: error.message });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      logger.info(`Sync Summary: ${successful} successful, ${failed} failed`);

      return results;
    } catch (error) {
      logger.error('Error in syncAllProjects:', error);
      throw error;
    }
  }

  getStatus() {
    return { isRunning: this.isRunning, activeJobs: this.jobs.size };
  }
}

module.exports = new SyncScheduler();
