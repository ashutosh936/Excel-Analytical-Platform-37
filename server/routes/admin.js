const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware to check admin
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
}

// Get all users and their uploads
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().populate('uploads');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router; 