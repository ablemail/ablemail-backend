const mongoose = require('mongoose');

const Settings = mongoose.model('settings', mongoose.Schema({
  uid: String,
  tts: Boolean,
  large: Boolean,
  dyslexia: Boolean,
  whitelist: [String],
  help: String,
  contacts: [{
    name: String,
    email: String
  }],
  voicemail: Boolean
}));

module.exports = Settings;