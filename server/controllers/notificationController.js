const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(50);

    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });

    res.status(200).json({
      success: true,
      unreadCount,
      data: notifications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark notification(s) as read
// @route   PATCH /api/notifications/read
// @access  Private
exports.markRead = async (req, res, next) => {
  try {
    const { id } = req.body;
    
    if (id) {
      // Mark single notification as read
      await Notification.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { $set: { read: true } }
      );
    } else {
      // Mark all user notifications as read
      await Notification.updateMany(
        { user: req.user.id, read: false },
        { $set: { read: true } }
      );
    }

    res.status(200).json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    next(err);
  }
};
