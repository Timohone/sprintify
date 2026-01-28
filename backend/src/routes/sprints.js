const express = require('express');
const router = express.Router();
const { Sprint, UserStory, CapacityPlan, User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/sprints?projectId=
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.projectId) where.projectId = req.query.projectId;

    const sprints = await Sprint.findAll({
      where,
      order: [['startDate', 'DESC']],
      include: [
        { model: UserStory, attributes: ['id', 'storyPoints', 'status'] },
        { model: CapacityPlan }
      ]
    });
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sprints/:id
router.get('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.id, {
      include: [
        {
          model: UserStory,
          include: [{ model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email'] }]
        },
        {
          model: CapacityPlan,
          include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }]
        }
      ]
    });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sprints
router.post('/', async (req, res) => {
  try {
    const sprint = await Sprint.create(req.body);
    res.status(201).json(sprint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/sprints/:id
router.put('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.id);
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });
    await sprint.update(req.body);
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
