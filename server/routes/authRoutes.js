const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refreshToken,
    logout,
    verifyEmail,
    forgotPassword,
    verifyOTP,
    resetPassword
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
