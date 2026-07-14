const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// @desc    Get chat message history with a specific user
// @route   GET /api/chat/:userId
// @access  Private
exports.getChatHistory = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    const messages = await ChatMessage.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort('timestamp');

    const receiverInfo = await User.findById(receiverId).select('name email role profileImage');

    res.status(200).json({
      success: true,
      receiver: receiverInfo,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a new chat message
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    const chatMessage = await ChatMessage.create({
      sender: senderId,
      receiver: receiverId,
      message
    });

    res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (err) {
    next(err);
  }
};
