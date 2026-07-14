const express = require('express');
const router = express.Router();
const { getNotifications, markRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getNotifications);

router.patch('/read', protect, markRead);

module.exports = router;
