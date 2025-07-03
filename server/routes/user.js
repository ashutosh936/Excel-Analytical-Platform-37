const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Upload = require('../models/Upload');
const router = express.Router();

// Get user profile and upload history
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('uploads');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router; 