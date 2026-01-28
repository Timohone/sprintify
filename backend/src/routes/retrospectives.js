const express = require('express');
const router = express.Router();
const { Retrospective, Sprint } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/retrospectives?sprintId=X
router.get('/', async (req, res) => {
  try {
    const { sprintId } = req.query;
    if (!sprintId) return res.status(400).json({ error: 'sprintId is required' });

    const retro = await Retrospective.findOne({ where: { sprintId } });
    res.json(retro || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/retrospectives
router.post('/', async (req, res) => {
  try {
    const { sprintId, wentWell, needsImprovement, actionItems } = req.body;
    if (!sprintId) return res.status(400).json({ error: 'sprintId is required' });

    const sprint = await Sprint.findByPk(sprintId);
    if (!sprint) return res.status(404).json({ error: 'Sprint not found' });

    const existing = await Retrospective.findOne({ where: { sprintId } });
    if (existing) return res.status(409).json({ error: 'Retrospective already exists for this sprint' });

    const retro = await Retrospective.create({
      sprintId,
      projectId: sprint.projectId,
      wentWell: wentWell || '',
      needsImprovement: needsImprovement || '',
      actionItems: actionItems || []
    });

    res.status(201).json(retro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/retrospectives/:id
router.patch('/:id', async (req, res) => {
  try {
    const retro = await Retrospective.findByPk(req.params.id);
    if (!retro) return res.status(404).json({ error: 'Retrospective not found' });

    const { wentWell, needsImprovement, actionItems } = req.body;
    if (wentWell !== undefined) retro.wentWell = wentWell;
    if (needsImprovement !== undefined) retro.needsImprovement = needsImprovement;
    if (actionItems !== undefined) retro.actionItems = actionItems;

    await retro.save();
    res.json(retro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
