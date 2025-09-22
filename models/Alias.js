//declare mongoose and alias data schema
const mongoose = require('mongoose');

//this schema defines the fields for alias
const aliasSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  platform: { type: String, required: true },
  username: { type: String, required: true },
  bio: { type: String },
  context: { type: String, enum: ['professional', 'casual', 'anonymous'] },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  encryptedEmail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

//export aliase schema using mongoose
module.exports = mongoose.model('Alias', aliasSchema);
