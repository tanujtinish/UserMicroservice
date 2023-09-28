const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  otp: { type: Number, required: false },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
});

module.exports = mongoose.model('User', userSchema, 'users');
