const mongoose = require('mongoose');

const User = mongoose.model('user', mongoose.Schema({
  name: String,
  googleID: String,
  email: String
}) );

module.exports = User;