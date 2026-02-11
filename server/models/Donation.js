const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',          // 👈 connect to Donor profile
    required: true
  },

  supporterUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',           // 👈 optional but useful for auth
    required: true
  },

  medicalCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalCase',    // 👈 FIXED (not User)
    required: true
  },

  amount: {
    type: Number,
    required: true,
    min: 1
  },

  razorpayOrderId: {
    type: String,
    required: true
  },

  razorpayPaymentId: String,

  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'card', 'netbanking'],
    default: 'razorpay'
  },

  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },

  receiptUrl: String,      // future feature
  notes: String            // admin comments if fraud/refund
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
