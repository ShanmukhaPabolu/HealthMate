const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Compatibility support: POST /profile acts as update, GET /profile gets it
router.route('/profile')
  .get(protect, getProfile)
  .post(protect, updateProfile)
  .patch(protect, updateProfile); // standard REST alternative

router.put('/change-password', protect, changePassword);

module.exports = router;
