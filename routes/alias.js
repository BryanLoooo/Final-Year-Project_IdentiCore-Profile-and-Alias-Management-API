// variable declaration and initialisation
const express = require('express');
const auth = require('../middleware/authMiddleware');
const Alias = require('../models/Alias');
const User = require('../models/User');

const router = express.Router();

// creating a new alias using post method
router.post('/', auth, async (req, res) => {
  const { platform, username, bio, context, visibility, encryptedEmail } = req.body;
  try {
    const alias = new Alias({
      user: req.user.id,
      platform,
      username,
      bio,
      context,
      visibility,
      encryptedEmail
    });
    await alias.save();
    
    // update user's last alias time
    await User.findByIdAndUpdate(req.user.id, { lastAliasCreatedAt: new Date() });
    res.status(201).json(alias);
    console.log('Saving alias:', req.body, 'for user:', req.user.id);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// retrieve all aliases for current user
router.get('/', auth, async (req, res) => {
  try {
    const aliases = await Alias.find({ user: req.user.id });
    res.json(aliases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get user account by context
router.get('/context/:tag', auth, async (req, res) => {
  try {
    const aliases = await Alias.find({ user: req.user.id, context: req.params.tag });
    res.json(aliases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update existing alias details
router.put('/:id', auth, async (req, res) => {
  try {
    const alias = await Alias.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(alias);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// delete an alias
router.delete('/:id', auth, async (req, res) => {
  try {
    await Alias.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Alias deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
