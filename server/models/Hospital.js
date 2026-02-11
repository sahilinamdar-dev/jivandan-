const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    // 🔗 Link to User (single source of truth)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    // 🏥 Basic Hospital Info
    hospitalName: {
      type: String,
      required: true,
      trim: true
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },

    hospitalType: {
      type: String,
      enum: ['government', 'private', 'trust'],
      required: true
    },

    // 📍 Address
    address: {
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },

    // 📞 Contact Details
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true }
    },

    // 🩺 Facilities
    facilities: [String],

    // 👨‍⚕️ Authorized Person
    authorizedPerson: {
      name: { type: String, required: true },
      designation: String,
      phone: String
    },

    // 📄 Documents (verification files)
    documents: {
      registrationCertificate: String,
      license: String
    },

    // 🔴 Soft Delete
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);