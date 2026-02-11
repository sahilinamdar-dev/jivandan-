// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: String,
//     gender: {
//         type: String,
//         enum: ['male', 'female', 'other', null],
//         default: null
//     },
//     dob: Date,
//     idNumber: String,
//     address: String,
//     city: String,
//     state: String,
//     role: {
//         type: String,
//         enum: ['patient', 'supporter', 'hospital', 'admin'],
//         required: true
//     },
//     supporterType: {
//         type: String,
//         enum: ['individual', 'ngo', null],
//         default: null
//     },
//     isEmailVerified: { type: Boolean, default: false },
//     verificationToken: String,
//     refreshToken: String,
//     organizationDetails: {
//         registrationNumber: String,
//         description: String,
//         website: String
//     },
//     profileImage: String,
//     resetPasswordOTP: String,
//     resetPasswordExpires: Date,
//     status: {
//         type: String,
//         enum: ['pending', 'approved', 'rejected', 'blacklisted'],
//         default: function () {
//             return (this.role === 'hospital' || (this.role === 'supporter' && this.supporterType === 'ngo')) ? 'pending' : 'approved';
//         }
//     },
//     statusReason: String
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


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
