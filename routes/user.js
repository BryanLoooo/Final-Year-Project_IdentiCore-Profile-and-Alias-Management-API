// user.js
// declare constants and requirements
const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      age: user.age,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      createdAt: user.createdAt,
      reminder: user.reminder
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// update reminder settings
router.put('/settings/reminder', auth, async (req, res) => {
  try {
    const { enabled, frequency } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.reminder.enabled = !!enabled;
    user.reminder.frequency = ['none','daily','weekly','monthly'].includes(frequency) ? frequency : 'none';
    await user.save();

    res.json({ message: 'Reminder settings updated', reminder: user.reminder });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// mark that a reminder prompt was shown/dismissed now
router.put('/reminder/prompted', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ message: 'User not found' });
    user.reminder = user.reminder || {};
    user.reminder.lastPromptAt = new Date();
    await user.save();
    res.json({ message: 'Prompt time recorded', lastPromptAt: user.reminder.lastPromptAt });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// update user profile
router.put('/settings/profile', auth, async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['username', 'email', 'age', 'addressLine1', 'addressLine2'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated', user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// delete current user's account
router.delete('/me', auth, async (req, res) => {
  try {
    // delete the user by their ID
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
module.exports = router;
