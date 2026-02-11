const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // 🔗 Link to base User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // 👤 Personal Details
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },

  dob: {
    type: Date,
    required: true
  },

  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },

  // 🏠 Address Info
  // ✅ FIXED ADDRESS STRUCTURE
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },

  // 🆔 Identity (optional but realistic)
  idProof: {
    type: {
      type: String,
      enum: ['aadhar', 'pan', 'passport']
    },
    number: String
  },

  // 🚨 Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },

  // 📄 Medical Summary (NOT detailed records)
  medicalSummary: {
    condition: String,
    treatmentRequired: String,
    estimatedCost: Number
  },

  // 📎 Documents
  medicalDocuments: [
    {
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now }
    }
  ],

  // 🔐 Privacy
  isProfileComplete: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
