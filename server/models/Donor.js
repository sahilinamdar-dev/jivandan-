const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  donorType: {
    type: String,
    enum: ['individual', 'ngo'],
    required: true
  },

  totalDonatedAmount: {
    type: Number,
    default: 0
  },

  donationCount: {
    type: Number,
    default: 0
  },

  organizationDetails: {
    name: String,
    registrationNumber: String,
    description: String,
    website: String,
    isVerified: { type: Boolean, default: false }
  },

  address: String,
  city: String,
  state: String,
  country: String,

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blacklisted'],
    default: 'approved'
  }

}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);
