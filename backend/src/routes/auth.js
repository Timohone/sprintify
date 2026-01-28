const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// GET /api/auth/me - Get current user from token
router.get('/me', authenticate, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    role: req.user.role,
    isActive: req.user.isActive
  });
});

module.exports = router;
