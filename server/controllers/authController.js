const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokens');
const { sendEmail, sendOTPEmail, sendResetOTPEmail } = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ErrorHandler = require('../utils/ErrorHandler');
const asyncHandler = require('../utils/asyncHandler');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload; // 'sub' is the unique Google ID

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        password: crypto.randomBytes(16).toString('hex'), // Secure random password
        role: "patient",
        isEmailVerified: true,
        status: "approved" // Or your default status
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return the same structure as your manual login
    res.json({ 
      token: accessToken, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } 
    });
  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err); // Check your terminal for this!
    res.status(401).json({ message: "Google authentication failed", detail: err.message });
  }
};


exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, supporterType, phone, organizationDetails, gender, dob, idNumber, address, city, state } = req.body;

    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler('User already exists', 400));

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        gender,
        dob,
        idNumber,
        address,
        city,
        state,
        supporterType: role === 'supporter' ? supporterType : null,
        organizationDetails: (role === 'hospital' || (role === 'supporter' && supporterType === 'ngo')) ? organizationDetails : null,
        verificationToken
    });

    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    const message = `<h1>Email Verification</h1><p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">${verificationUrl}</a>`;

    try {
        await sendEmail(user.email, 'TrustAid Email Verification', message);
        res.status(201).json({ message: 'User registered. Please check your email for verification.' });
    } catch (err) {
        console.error('Email error:', err);
        res.status(201).json({ message: 'User registered, but email failed to send.' });
    }
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler('Invalid credentials', 400));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler('Invalid credentials', 400));

    // Check status for hospital and NGOs
    if (user.status === 'pending' && (user.role === 'hospital' || (user.role === 'supporter' && user.supporterType === 'ngo'))) {
        return next(new ErrorHandler('Your account is pending approval by the administrator.', 403));
    }

    if (user.status === 'rejected') {
        return next(new ErrorHandler('Your registration request has been rejected.', 403));
    }

    if (user.status === 'blacklisted') {
        return next(new ErrorHandler('Your account has been blacklisted. Please contact support.', 403));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
        token: accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified
        }
    });
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(new ErrorHandler('No refresh token', 401));

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return next(new ErrorHandler('Invalid refresh token', 403));
        }

        const accessToken = generateAccessToken(user);
        res.json({
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (err) {
        return next(new ErrorHandler('Token expired or invalid', 403));
    }
});

exports.logout = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return next(new ErrorHandler('Invalid token', 400));

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler('User not found', 404));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendResetOTPEmail(user.email, otp);
    res.json({ message: 'OTP sent to your email' });
});

exports.verifyOTP = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return next(new ErrorHandler('Invalid or expired OTP', 400));

    res.json({ message: 'OTP verified successfully' });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return next(new ErrorHandler('Invalid or expired OTP', 400));

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
});
