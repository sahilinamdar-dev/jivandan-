const User = require('../models/User');
const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');
const Donor = require('../models/Donor');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { generateAccessToken, generateRefreshToken } = require('../utils/tokens');
const { sendEmail, sendResetOTPEmail } = require('../utils/sendEmail');

const ErrorHandler = require('../utils/ErrorHandler');
const asyncHandler = require('../utils/asyncHandler');

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.registerSupporter = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, donorType, organizationDetails, address, city, state, country } = req.body;

  // check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User already exists', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: 'supporter',
    status: 'approved',
    verificationToken
  });

  // 🔹 auto-create Donor profile (BEST UX)
  await Donor.create({
    user: user._id,
    donorType: donorType || 'individual',
    organizationDetails,
    address,
    city,
    state,
    country
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  await sendEmail(
    email,
    'Email Verification',
    `<p>Please verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`
  );

  res.status(201).json({
    message: 'Supporter registered successfully. Please verify your email.'
  });
});

exports.registerPatient = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, gender, dob, emergencyContact, address } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User already exists', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: 'patient',
    status: 'approved',
    verificationToken
  });

  // Create Patient
  await Patient.create({
    userId: user._id,
    gender,
    dob,
    emergencyContact,
    address
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  await sendEmail(
    email,
    'Email Verification',
    `<p>Please verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`
  );

  res.status(201).json({
    message: 'Patient registered successfully. Please verify your email.'
  });
});

exports.registerHospital = asyncHandler(async (req, res, next) => {
  const {
    hospitalName,
    email,
    password,
    phone,
    registrationNumber,
    hospitalType,
    address,
    contact,
    authorizedPerson,
    specialities
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User already exists', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create User (pending approval)
  const user = await User.create({
    name: hospitalName,
    email,
    password: hashedPassword,
    phone,
    role: 'hospital',
    status: 'pending',
    verificationToken
  });

  // Create Hospital profile
  const hospital = await Hospital.create({
    userId: user._id,
    hospitalName,
    registrationNumber,
    hospitalType,
    address,
    contact,
    authorizedPerson,
    specialities
  });

  res.status(201).json({
    success: true,
    message: 'Hospital registered successfully. Waiting for admin approval.',
    hospital
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler('Invalid credentials', 400));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler('Invalid credentials', 400));

  if (user.status !== 'approved') {
    return next(new ErrorHandler('Account not approved by admin', 403));
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      role: user.role
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
    res.json({ token: accessToken });
  } catch {
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

  // 🔥 Store OTP in Redis (10 min expiry)
  await redisClient.setEx(
    `reset:otp:${email}`,
    600,
    otp
  );

  await sendResetOTPEmail(user.email, otp);

  res.json({ message: 'OTP sent to your email' });

});


exports.verifyOTP = asyncHandler(async (req, res, next) => {

  const { email, otp } = req.body;

  const storedOtp = await redisClient.get(`reset:otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    return next(new ErrorHandler('Invalid or expired OTP', 400));
  }

  res.json({ message: 'OTP verified successfully' });

});
exports.resetPassword = asyncHandler(async (req, res, next) => {

  const { email, otp, newPassword } = req.body;

  const storedOtp = await redisClient.get(`reset:otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    return next(new ErrorHandler('Invalid or expired OTP', 400));
  }

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler('User not found', 404));

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  // 🔥 Delete OTP after successful reset
  await redisClient.del(`reset:otp:${email}`);

  res.json({ message: 'Password reset successfully' });

});

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        password: crypto.randomBytes(16).toString('hex'),
        role: "patient",
        isEmailVerified: true,
        status: "approved"
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
    console.error("GOOGLE LOGIN ERROR:", err);
    res.status(401).json({ message: "Google authentication failed", detail: err.message });
  }
};

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return next(new ErrorHandler('User not found', 404));

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
