//declare mongoose
const mongoose = require('mongoose');

//defines the fields for the reminder schema
const reminderSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  frequency: { type: String, enum: ['none','daily','weekly','monthly'], default: 'none' },
  lastPromptAt: { type: Date }
}, { _id: false });

//defines the fields for the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  age: { type: Number },
  addressLine1: { type: String },
  addressLine2: { type: String },
  lastAliasCreatedAt: { type: Date },
  reminder: { type: reminderSchema, default: () => ({ enabled:false, frequency:'none' }) }
});
//export user schema using mongoose
module.exports = mongoose.model('User', userSchema);
