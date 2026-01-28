const express = require('express');
const router = express.Router();
const { Sprint, UserStory, CapacityPlan, User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/export/sprint/:sprintId/report
router.get('/sprint/:sprintId/report', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.sprintId, {
      include: [
        { model: UserStory },
        { model: CapacityPlan, include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }] }
      ]
    });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    const stories = sprint.UserStories || [];
    const totalPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    const donePoints = stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    const completionRate = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

    res.json({
      sprint: {
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status,
        goal: sprint.goal
      },
      summary: {
        totalStories: stories.length,
        completedStories: stories.filter(s => s.status === 'Done').length,
        totalPoints,
        donePoints,
        completionRate,
        velocity: donePoints
      },
      stories: stories.map(s => ({
        title: s.title,
        jiraKey: s.jiraKey,
        status: s.status,
        priority: s.priority,
        storyPoints: s.storyPoints || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
