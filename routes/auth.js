// declare constants and requirements
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

//load AES key
function loadAesKey() {
  const hex = process.env.AES_SECRET;
  if (!hex) throw new Error('AES_SECRET is not set (64 hex chars for a 32-byte key).');
  const key = Buffer.from(hex, 'hex');
  if (key.length !== 32) throw new Error('AES_SECRET must be 32 bytes (64 hex chars).');
  return key;
}
const AES_KEY = loadAesKey();

//encrypt the data
function encrypt(text) {
  if (text == null || text === '') return null; // store null if empty
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', AES_KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag(); // 16 bytes

  //pack as base64
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

function decrypt(b64) {
  if (!b64) return null;
  const buf = Buffer.from(b64, 'base64');
  if (buf.length < 12 + 16) throw new Error('Encrypted payload too short');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);

  const decipher = crypto.createDecipheriv('aes-256-gcm', AES_KEY, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
  return plaintext.toString('utf8');
}

// gracefully handle legacy plaintext (or bad data)
function safeDecrypt(value) {
  try {
    return decrypt(value);
  } catch {
    // If it wasn't encrypted before, just return as-is
    return value ?? null;
  }
}
// registration post method
router.post('/register', async (req, res) => {
  const { email, password, username, age, addressLine1, addressLine2 } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed,                 
      username,
      age,
      addressLine1: encrypt(addressLine1),
      addressLine2: encrypt(addressLine2),
      reminder: { enabled: false, frequency: 'none' }
    });

    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//login post method
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log('Generated JWT Token:', token);

    //if you want to return profile fields on login, decrypt them
    const addr1 = safeDecrypt(user.addressLine1);
    const addr2 = safeDecrypt(user.addressLine2);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        age: user.age,
        addressLine1: addr1,
        addressLine2: addr2,
        reminder: user.reminder
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;

