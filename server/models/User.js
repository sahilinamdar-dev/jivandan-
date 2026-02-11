const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: {
    type: String,
    enum: ['patient', 'supporter', 'hospital', 'admin'],
    required: true
  },
  isEmailVerified: { type: Boolean, default: false },
  refreshToken: String,
  activeCases: { // this is change 
  type: Number,
  default: 0
}
,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blacklisted'],
    default: 'approved'// status will change 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);