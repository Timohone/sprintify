const express = require('express');
const router = express.Router();
const { UserStory, User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/user-stories?sprintId=&projectId=
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.sprintId) where.sprintId = req.query.sprintId;
    if (req.query.projectId) where.projectId = req.query.projectId;

    const stories = await UserStory.findAll({
      where,
      include: [{ model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email'] }],
      order: [['priority', 'ASC'], ['title', 'ASC']]
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user-stories/:id
router.get('/:id', async (req, res) => {
  try {
    const story = await UserStory.findByPk(req.params.id, {
      include: [{ model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email'] }]
    });
    if (!story) return res.status(404).json({ error: 'User story not found' });
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/user-stories/:id
router.put('/:id', async (req, res) => {
  try {
    const story = await UserStory.findByPk(req.params.id);
    if (!story) return res.status(404).json({ error: 'User story not found' });
    await story.update(req.body);
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
