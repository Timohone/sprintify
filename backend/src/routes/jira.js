const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');
const JiraService = require('../services/JiraService');
const SyncScheduler = require('../services/SyncScheduler');

router.use(authenticate);

// POST /api/jira/test-connection/:projectId
router.post('/test-connection/:projectId', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const jiraService = new JiraService(project);
    const result = await jiraService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/jira/sync/:projectId
router.post('/sync/:projectId', requireAdmin, async (req, res) => {
  try {
    const result = await JiraService.syncProject(req.params.projectId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/jira/full-sync/:projectId
router.post('/full-sync/:projectId', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const jiraService = new JiraService(project);
    const result = await jiraService.fullSync();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jira/sync-status
router.get('/sync-status', requireAdmin, (req, res) => {
  res.json(SyncScheduler.getStatus());
});

module.exports = router;
