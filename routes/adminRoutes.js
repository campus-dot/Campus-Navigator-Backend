const express = require('express');
const { protect, isAppAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

router.post('/create-admin', protect, isAppAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = new User({ username, password, role });
  await newUser.save();
  res.status(201).json({ message: 'Admin created successfully' });
});

module.exports = router;
