const mongoose = require('mongoose');

const User = mongoose.model('user', mongoose.Schema({
  name: String,
  email: String,
  password: String
}) );

module.exports = User;