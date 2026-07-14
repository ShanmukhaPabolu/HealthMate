const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Format compatible with original frontends (which expect keys like user_email, name, etc.)
    const profileResponse = {
      ...user.toObject(),
      user_email: user.email // for backwards compatibility with healthmate-utils.js
    };

    res.status(200).json({
      success: true,
      data: profileResponse
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   POST /api/user/profile (POST /api/user/profile is used in original script)
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      gender: req.body.gender,
      dob: req.body.dob,
      address: req.body.address,
      profileImage: req.body.profileImage
    };

    // Remove undefined values
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    // If healthProfile fields are passed
    if (req.body.healthProfile) {
      fieldsToUpdate.healthProfile = {
        ...req.body.healthProfile
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change Password
// @route   PUT /api/user/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    next(err);
  }
};
