const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createFirstAdmin = async () => {
  const firstAdmin = await User.findOne({ role: 'appAdmin' });
  if (!firstAdmin) {
    const newUser = new User({
      username: 'firstAdmin',
      password: 'firstAdmin123',
      role: 'appAdmin'
    });
    await newUser.save();
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

module.exports = { createFirstAdmin, login };
