const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, sendMessage);

router.get('/:userId', protect, getChatHistory);

module.exports = router;
