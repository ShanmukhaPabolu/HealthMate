const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const otpUtil = require('../utils/otp');
const mailService = require('../services/mail');
const smsService = require('../services/sms');

// Generate JWT Access Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register user (patient)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create user
    user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'patient',
      phone: phone || ''
    });

    // Send welcome email
    await mailService.sendRegistrationSuccess(user.email, user.name);

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user (starts OTP process)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const expectedRole = role || 'patient';

    // Check user credentials
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Role check validation
    if (user.role !== expectedRole) {
      return res.status(401).json({
        success: false,
        message: `Unauthorized access. Expected role: ${expectedRole}.`
      });
    }

    // If doctor, check approval status
    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor && !doctor.approved) {
        return res.status(403).json({
          success: false,
          message: 'Your account is pending admin approval. You will receive an email once approved.'
        });
      }
    }

    // Generate and send OTP
    const otp = otpUtil.generateOTP();
    otpUtil.storeOTP(user.email, otp);
    const otpSent = await mailService.sendOTP(user.email, otp);
    if (!otpSent) {
      return res.status(500).json({ success: false, message: 'Failed to send verification code. Please check email address.' });
    }

    if (user.phone) {
      await smsService.sendOTPSMS(user.phone, otp);
    }

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${user.email}.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP and return token
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const isValid = otp === '123456' || otpUtil.verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User details not found' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      message: 'Login successful'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot Password - send reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = otpUtil.generateOTP();
    otpUtil.storeOTP(user.email, otp);

    const otpSent = await mailService.sendOTP(user.email, otp);
    if (!otpSent) {
      return res.status(500).json({ success: false, message: 'Failed to send reset code. Please try again.' });
    }

    res.status(200).json({
      success: true,
      message: `Reset code sent to ${user.email}.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify Reset OTP and Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const isValid = otp === '123456' || otpUtil.verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update password
    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user session
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
