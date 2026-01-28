const express = require('express');
const router = express.Router();
const { Project, ProjectUser, User } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { isActive: true },
      include: [{
        model: ProjectUser,
        include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }]
      }],
      order: [['name', 'ASC']]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{
        model: ProjectUser,
        include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }]
      }]
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, jiraProjectKey, jiraBoardId, jiraServerUrl, jiraUsername, jiraApiToken, config } = req.body;
    const project = await Project.create({
      name, jiraProjectKey, jiraBoardId, jiraServerUrl, jiraUsername, jiraApiToken, config
    });
    // Add creator as admin
    await ProjectUser.create({ projectId: project.id, userId: req.user.id, role: 'admin' });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { name, jiraProjectKey, jiraBoardId, jiraServerUrl, jiraUsername, jiraApiToken, config, isActive } = req.body;
    await project.update({
      ...(name !== undefined && { name }),
      ...(jiraProjectKey !== undefined && { jiraProjectKey }),
      ...(jiraBoardId !== undefined && { jiraBoardId }),
      ...(jiraServerUrl !== undefined && { jiraServerUrl }),
      ...(jiraUsername !== undefined && { jiraUsername }),
      ...(jiraApiToken !== undefined && { jiraApiToken }),
      ...(config !== undefined && { config }),
      ...(isActive !== undefined && { isActive })
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects/:id/members
router.post('/:id/members', requireAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const [membership, created] = await ProjectUser.findOrCreate({
      where: { projectId: req.params.id, userId },
      defaults: { role: role || 'member' }
    });
    if (!created) {
      await membership.update({ role: role || membership.role });
    }
    res.status(created ? 201 : 200).json(membership);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/projects/:id/members/:userId
router.delete('/:id/members/:userId', requireAdmin, async (req, res) => {
  try {
    const deleted = await ProjectUser.destroy({
      where: { projectId: req.params.id, userId: req.params.userId }
    });
    if (!deleted) return res.status(404).json({ error: 'Membership not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
