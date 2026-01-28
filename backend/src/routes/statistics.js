const express = require('express');
const router = express.Router();
const { Sprint, UserStory, CapacityPlan, User, Project } = require('../models');
const { authenticate } = require('../middleware/auth');
const { Op } = require('sequelize');

router.use(authenticate);

// GET /api/statistics/sprint/:sprintId
router.get('/sprint/:sprintId', async (req, res) => {
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
    const inProgressPoints = stories.filter(s => s.status === 'In Progress').reduce((sum, s) => sum + (s.storyPoints || 0), 0);

    const capacityPlans = sprint.CapacityPlans || [];
    const totalAvailableHours = capacityPlans.reduce((sum, c) => sum + (c.availableHours || 0), 0);
    const totalAllocatedHours = capacityPlans.reduce((sum, c) => sum + (c.allocatedHours || 0), 0);

    const statusBreakdown = {
      'To Do': stories.filter(s => s.status === 'To Do').length,
      'In Progress': stories.filter(s => s.status === 'In Progress').length,
      'Done': stories.filter(s => s.status === 'Done').length
    };

    const priorityBreakdown = {
      Critical: stories.filter(s => s.priority === 'Critical').length,
      High: stories.filter(s => s.priority === 'High').length,
      Medium: stories.filter(s => s.priority === 'Medium').length,
      Low: stories.filter(s => s.priority === 'Low').length
    };

    // Calculate days remaining
    const now = new Date();
    const endDate = sprint.endDate ? new Date(sprint.endDate) : now;
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

    const doneStories = stories.filter(s => s.status === 'Done');
    const completionRate = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

    // Stories added/removed during sprint (created after sprint start)
    const sprintStart = sprint.startDate ? new Date(sprint.startDate) : null;
    const storiesAdded = sprintStart
      ? stories.filter(s => s.createdAt && new Date(s.createdAt) > sprintStart).map(s => ({
          title: s.title,
          points: s.storyPoints,
          status: s.status,
          dateAdded: s.createdAt
        }))
      : [];

    res.json({
      sprint: { id: sprint.id, name: sprint.name, status: sprint.status, startDate: sprint.startDate, endDate: sprint.endDate },
      // Flat fields for frontend
      totalStories: stories.length,
      completedStories: doneStories.length,
      velocity: donePoints,
      completionRate,
      daysRemaining,
      // Nested for backward compat
      stories: { total: stories.length, totalPoints, donePoints, inProgressPoints, completionRate: totalPoints > 0 ? donePoints / totalPoints : 0 },
      capacity: { totalAvailableHours, totalAllocatedHours, utilizationRate: totalAvailableHours > 0 ? totalAllocatedHours / totalAvailableHours : 0 },
      statusBreakdown,
      priorityBreakdown,
      storiesAdded,
      storiesRemoved: [],
      memberCapacity: capacityPlans.map(c => ({
        user: c.User,
        availableHours: c.availableHours,
        allocatedHours: c.allocatedHours
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/statistics/project/:projectId/velocity
router.get('/project/:projectId/velocity', async (req, res) => {
  try {
    const sprints = await Sprint.findAll({
      where: { projectId: req.params.projectId, status: 'completed' },
      include: [{ model: UserStory }],
      order: [['endDate', 'DESC']],
      limit: 20
    });
    sprints.reverse(); // Show oldest-to-newest in chart

    const velocity = sprints.map(sprint => {
      const stories = sprint.UserStories || [];
      const donePoints = stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + (s.storyPoints || 0), 0);
      return {
        sprintId: sprint.id,
        sprintName: sprint.name,
        endDate: sprint.endDate,
        velocity: donePoints,
        totalPoints: stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0),
        storiesCompleted: stories.filter(s => s.status === 'Done').length,
        storiesTotal: stories.length
      };
    });

    const avgVelocity = velocity.length > 0
      ? velocity.reduce((sum, v) => sum + v.velocity, 0) / velocity.length
      : 0;

    res.json({ velocity, averageVelocity: avgVelocity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/statistics/project/:projectId/dashboard
router.get('/project/:projectId/dashboard', async (req, res) => {
  try {
    const sprints = await Sprint.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: UserStory }]
    });

    const allStories = sprints.flatMap(s => s.UserStories || []);
    const completedStories = allStories.filter(s => s.status === 'Done');
    const totalPoints = allStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    const completedPoints = completedStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);

    const activeSprints = sprints.filter(s => s.status === 'active');
    const completedSprints = sprints.filter(s => s.status === 'completed');

    const velocities = completedSprints.map(sprint => {
      const stories = sprint.UserStories || [];
      return stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    });
    const avgVelocity = velocities.length > 0
      ? velocities.reduce((sum, v) => sum + v, 0) / velocities.length
      : 0;

    const completionRate = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

    // Success rate: sprints where completion rate >= 80%
    const successfulSprints = completedSprints.filter(sprint => {
      const stories = sprint.UserStories || [];
      const tp = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
      const dp = stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + (s.storyPoints || 0), 0);
      return tp > 0 && (dp / tp) >= 0.8;
    });
    const successRate = completedSprints.length > 0
      ? (successfulSprints.length / completedSprints.length) * 100
      : 0;

    res.json({
      totalSprints: { active: activeSprints.length, total: sprints.length },
      totalStories: { completed: completedStories.length, total: allStories.length },
      storyPoints: { completed: completedPoints, total: totalPoints },
      completionRate: Math.round(completionRate * 100) / 100,
      sprintOverview: {
        activeSprints: activeSprints.length,
        completedSprints: completedSprints.length,
        totalSprints: sprints.length,
        averageVelocity: Math.round(avgVelocity * 100) / 100,
        successRate: Math.round(successRate * 100) / 100
      },
      storyProgress: {
        totalStoryPoints: totalPoints,
        completedPoints,
        totalStories: allStories.length,
        completedStories: completedStories.length,
        storyPointsRate: totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 10000) / 100 : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/statistics/sprint/:sprintId/team-performance
router.get('/sprint/:sprintId/team-performance', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.sprintId, {
      include: [
        {
          model: UserStory,
          include: [{ model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName'] }]
        }
      ]
    });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    const stories = sprint.UserStories || [];
    const memberMap = {};

    for (const story of stories) {
      const user = story.assignee;
      if (!user) continue;
      const uid = user.id;
      if (!memberMap[uid]) {
        memberMap[uid] = {
          userId: uid,
          name: `${user.firstName} ${user.lastName}`,
          totalPoints: 0,
          donePoints: 0,
          totalStories: 0,
          doneStories: 0
        };
      }
      memberMap[uid].totalPoints += story.storyPoints || 0;
      memberMap[uid].totalStories += 1;
      if (story.status === 'Done') {
        memberMap[uid].donePoints += story.storyPoints || 0;
        memberMap[uid].doneStories += 1;
      }
    }

    const members = Object.values(memberMap).map(m => ({
      userId: m.userId,
      name: m.name,
      velocity: m.donePoints,
      completionRate: m.totalPoints > 0 ? Math.round((m.donePoints / m.totalPoints) * 10000) / 100 : 0,
      storiesCount: m.totalStories
    }));

    const totalPoints = members.reduce((sum, m) => sum + m.velocity, 0);
    const topVelocity = members.length > 0 ? Math.max(...members.map(m => m.velocity)) : 0;
    const avgCompletion = members.length > 0
      ? Math.round(members.reduce((sum, m) => sum + m.completionRate, 0) / members.length * 100) / 100
      : 0;

    res.json({
      members,
      teamSummary: {
        topVelocity,
        avgCompletion,
        teamSize: members.length,
        totalPoints
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/statistics/sprint/:sprintId/burndown
router.get('/sprint/:sprintId/burndown', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.sprintId, {
      include: [{ model: UserStory }]
    });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    const stories = sprint.UserStories || [];
    const totalPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);

    // Calculate ideal burndown line
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const totalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const dailyBurn = totalPoints / totalDays;

    const idealBurndown = [];
    const dateStrings = [];
    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const ds = date.toISOString().split('T')[0];
      dateStrings.push(ds);
      idealBurndown.push({
        date: ds,
        remaining: Math.round((totalPoints - dailyBurn * i) * 100) / 100
      });
    }

    // Compute actual burndown from story updatedAt dates for done stories
    const doneStories = stories.filter(s => s.status === 'Done');
    const today = new Date().toISOString().split('T')[0];
    const actualBurndown = [];
    for (const ds of dateStrings) {
      if (ds > today) break;
      // Count points completed on or before this date
      const completedByDate = doneStories
        .filter(s => s.updatedAt && new Date(s.updatedAt).toISOString().split('T')[0] <= ds)
        .reduce((sum, s) => sum + (s.storyPoints || 0), 0);
      actualBurndown.push({
        date: ds,
        remaining: Math.round((totalPoints - completedByDate) * 100) / 100
      });
    }

    res.json({
      sprint: { id: sprint.id, name: sprint.name, startDate: sprint.startDate, endDate: sprint.endDate },
      totalPoints,
      burndownData: sprint.burndownData || null,
      idealBurndown,
      actualBurndown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/statistics/sprint/:sprintId/comparison
router.get('/sprint/:sprintId/comparison', async (req, res) => {
  try {
    const sprint = await Sprint.findByPk(req.params.sprintId, {
      include: [{ model: UserStory }]
    });
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    const currentStories = sprint.UserStories || [];
    const currentTotalPoints = currentStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    const currentVelocity = currentStories.filter(s => s.status === 'Done').reduce((sum, s) => sum + (s.storyPoints || 0), 0);

    // Find previous sprint (same project, ended before this one)
    const previousSprint = await Sprint.findOne({
      where: {
        projectId: sprint.projectId,
        id: { [Op.ne]: sprint.id },
        endDate: { [Op.lt]: sprint.startDate }
      },
      include: [{ model: UserStory }],
      order: [['endDate', 'DESC']]
    });

    let previousVelocity = null;
    let previousTotalPoints = null;
    if (previousSprint) {
      const prevStories = previousSprint.UserStories || [];
      previousTotalPoints = prevStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
      previousVelocity = prevStories.filter(s => s.status === 'Done').reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    }

    // Team benchmarks across all completed sprints in this project
    const allSprints = await Sprint.findAll({
      where: { projectId: sprint.projectId, status: 'completed' },
      include: [{ model: UserStory }]
    });

    const velocities = allSprints.map(s => {
      const st = s.UserStories || [];
      return st.filter(x => x.status === 'Done').reduce((sum, x) => sum + (x.storyPoints || 0), 0);
    });

    const avgVelocity = velocities.length > 0
      ? velocities.reduce((sum, v) => sum + v, 0) / velocities.length
      : 0;
    const bestPerformance = velocities.length > 0 ? Math.max(...velocities) : 0;

    res.json({
      current: {
        id: sprint.id,
        name: sprint.name,
        velocity: currentVelocity,
        totalPoints: currentTotalPoints,
        storiesTotal: currentStories.length,
        storiesCompleted: currentStories.filter(s => s.status === 'Done').length
      },
      previous: previousSprint ? {
        id: previousSprint.id,
        name: previousSprint.name,
        velocity: previousVelocity,
        totalPoints: previousTotalPoints,
        storiesTotal: (previousSprint.UserStories || []).length,
        storiesCompleted: (previousSprint.UserStories || []).filter(s => s.status === 'Done').length
      } : null,
      benchmarks: {
        averageVelocity: Math.round(avgVelocity * 100) / 100,
        bestVelocity: bestPerformance,
        bestPerformance,
        sprintCount: allSprints.length
      },
      velocityChange: previousVelocity !== null ? currentVelocity - previousVelocity : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/statistics/project/:projectId/forecast
router.get('/project/:projectId/forecast', async (req, res) => {
  try {
    const sprints = await Sprint.findAll({
      where: { projectId: req.params.projectId, status: 'completed' },
      include: [{ model: UserStory }],
      order: [['endDate', 'DESC']],
      limit: 6
    });

    const velocities = sprints.map(sprint => {
      const stories = sprint.UserStories || [];
      return stories.filter(s => s.status === 'Done').reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    });

    const avgVelocity = velocities.length > 0
      ? velocities.reduce((sum, v) => sum + v, 0) / velocities.length
      : 0;
    const minVelocity = velocities.length > 0 ? Math.min(...velocities) : 0;
    const maxVelocity = velocities.length > 0 ? Math.max(...velocities) : 0;

    // Calculate remaining backlog points (all non-Done stories in the project)
    const allStories = await UserStory.findAll({
      where: { projectId: req.params.projectId, status: { [Op.ne]: 'Done' } }
    });
    const remainingPoints = allStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);

    const sprintsRemaining = avgVelocity > 0 ? Math.ceil(remainingPoints / avgVelocity) : null;
    const sprintsRemainingBest = maxVelocity > 0 ? Math.ceil(remainingPoints / maxVelocity) : null;
    const sprintsRemainingWorst = minVelocity > 0 ? Math.ceil(remainingPoints / minVelocity) : null;

    // Estimate completion date based on average sprint duration
    let estimatedCompletionDate = null;
    if (sprintsRemaining !== null && sprints.length > 0) {
      const durations = sprints
        .filter(s => s.startDate && s.endDate)
        .map(s => new Date(s.endDate) - new Date(s.startDate));
      const avgDuration = durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 14 * 24 * 60 * 60 * 1000; // default 2 weeks
      const completionMs = Date.now() + sprintsRemaining * avgDuration;
      estimatedCompletionDate = new Date(completionMs).toISOString().split('T')[0];
    }

    // Capacity-based SP recommendation
    let recommendedPoints = Math.round(avgVelocity);
    let currentSprintCapacity = null;
    let avgHistoricalCapacity = null;

    // Find current planning or active sprint
    const currentSprint = await Sprint.findOne({
      where: {
        projectId: req.params.projectId,
        status: { [Op.in]: ['active', 'planning'] }
      },
      order: [['startDate', 'DESC']]
    });

    if (currentSprint) {
      // Current sprint capacity
      const currentPlans = await CapacityPlan.findAll({
        where: { sprintId: currentSprint.id }
      });
      currentSprintCapacity = currentPlans.reduce((sum, c) => sum + (c.availableHours || 0), 0);

      // Historical capacity from completed sprints (already loaded above)
      if (sprints.length > 0) {
        const historicalSprintIds = sprints.map(s => s.id);
        const historicalPlans = await CapacityPlan.findAll({
          where: { sprintId: { [Op.in]: historicalSprintIds } }
        });
        const capacityBySprint = {};
        for (const plan of historicalPlans) {
          capacityBySprint[plan.sprintId] = (capacityBySprint[plan.sprintId] || 0) + (plan.availableHours || 0);
        }
        const capacities = Object.values(capacityBySprint).filter(c => c > 0);
        if (capacities.length > 0) {
          avgHistoricalCapacity = capacities.reduce((a, b) => a + b, 0) / capacities.length;
          if (avgHistoricalCapacity > 0 && currentSprintCapacity > 0) {
            const capacityFactor = currentSprintCapacity / avgHistoricalCapacity;
            recommendedPoints = Math.round(avgVelocity * capacityFactor);
          }
        }
      }
    }

    res.json({
      avgVelocity: Math.round(avgVelocity * 100) / 100,
      minVelocity,
      maxVelocity,
      remainingPoints,
      sprintsRemaining,
      sprintsRemainingBest,
      sprintsRemainingWorst,
      estimatedCompletionDate,
      completedSprintsAnalyzed: sprints.length,
      recommendedPoints,
      currentSprintCapacity,
      avgHistoricalCapacity: avgHistoricalCapacity !== null ? Math.round(avgHistoricalCapacity * 100) / 100 : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
