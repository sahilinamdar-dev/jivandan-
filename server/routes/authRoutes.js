const express = require('express');
const router = express.Router();

const {
  registerPatient,
  registerHospital,
  registerSupporter,
  login,
  refreshToken,
  logout,
  googleLogin,
  verifyEmail,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require('../controllers/authController');

// ✅ Registration
router.post('/register/patient', registerPatient);
router.post('/register/hospital', registerHospital);
router.post('/register/supporter', registerSupporter);

// ✅ Auth
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// ✅ Email & Password
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// ⭐ NEW

module.exports = router;