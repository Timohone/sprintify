const express = require('express');
const router = express.Router();
const { User, CapacityPlan, ProjectUser, UserStory } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'lastLogin', 'jiraAccountId', 'jiraDisplayName'],
      order: [['firstName', 'ASC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'lastLogin', 'jiraAccountId', 'jiraDisplayName']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/users/:id - Admin only
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { role, isActive } = req.body;
    await user.update({
      ...(role !== undefined && { role }),
      ...(isActive !== undefined && { isActive })
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Remove related records before deleting user
    await CapacityPlan.destroy({ where: { userId: user.id } });
    await ProjectUser.destroy({ where: { userId: user.id } });
    await UserStory.update({ assigneeId: null }, { where: { assigneeId: user.id } });

    await user.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
