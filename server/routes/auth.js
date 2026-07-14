const express = require('express');
const router = express.Router();
const { register, login, verifyOtp, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validation');

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
