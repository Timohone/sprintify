const express = require('express');
const router = express.Router();
const { CapacityPlan, User, Sprint, ProjectUser } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Helper: generate weekly capacity entries from sprint dates
function generateWeeks(startDate, endDate) {
  const weeks = [];
  if (!startDate || !endDate) return weeks;
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Align to Monday
  const day = start.getDay();
  const monday = new Date(start);
  monday.setDate(monday.getDate() - ((day + 6) % 7));

  while (monday < end) {
    const weekEnd = new Date(monday);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const dd = (d) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
    weeks.push({
      week: `${dd(monday)} - ${dd(weekEnd)}`,
      holiday: 0,
      customer: 0,
      internal: 0,
      other: 0
    });
    monday.setDate(monday.getDate() + 7);
  }
  return weeks;
}

// GET /api/capacity-plans?sprintId=
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.sprintId) where.sprintId = req.query.sprintId;
    if (req.query.userId) where.userId = req.query.userId;

    // Auto-create capacity plans for project members if sprintId is provided
    if (req.query.sprintId) {
      const sprint = await Sprint.findByPk(req.query.sprintId);
      if (sprint) {
        const projectMembers = await ProjectUser.findAll({ where: { projectId: sprint.projectId } });
        const existingPlans = await CapacityPlan.findAll({ where: { sprintId: sprint.id }, attributes: ['userId'] });
        const existingUserIds = new Set(existingPlans.map(p => p.userId));

        const weeks = generateWeeks(sprint.startDate, sprint.endDate);

        for (const member of projectMembers) {
          if (!existingUserIds.has(member.userId)) {
            await CapacityPlan.create({
              userId: member.userId,
              sprintId: sprint.id,
              availableHours: weeks.length * 40,
              allocatedHours: 0,
              weeklyCapacity: weeks
            });
          }
        }
      }
    }

    const plans = await CapacityPlan.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Sprint, attributes: ['id', 'name', 'startDate', 'endDate'] }
      ]
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/capacity-plans
router.post('/', async (req, res) => {
  try {
    const { userId, sprintId, availableHours, allocatedHours, weeklyCapacity, availabilityDays } = req.body;
    const [plan, created] = await CapacityPlan.findOrCreate({
      where: { userId: userId || req.user.id, sprintId },
      defaults: { availableHours, allocatedHours, weeklyCapacity, availabilityDays }
    });
    if (!created) {
      await plan.update({ availableHours, allocatedHours, weeklyCapacity, availabilityDays });
    }
    res.status(created ? 201 : 200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/capacity-plans/:id
router.put('/:id', async (req, res) => {
  try {
    const plan = await CapacityPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Capacity plan not found' });
    await plan.update(req.body);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/capacity-plans/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await CapacityPlan.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Capacity plan not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
