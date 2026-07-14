const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// @desc    Get reviews (optionally filtered by doctorId)
// @route   GET /api/reviews?doctorId=X&limit=10
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.doctorId) query.doctor = req.query.doctorId;
    const limit = parseInt(req.query.limit) || 20;

    const reviews = await Review.find(query)
      .populate('patient', 'name profileImage')
      .populate('doctor', 'specialization')
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a review for a doctor
// @route   POST /api/reviews
// @access  Private (Patient only)
exports.addReview = async (req, res, next) => {
  try {
    const { doctorId, rating, comment } = req.body;

    // Check if patient had a COMPLETED appointment with the doctor
    const appointment = await Appointment.findOne({
      patient: req.user.id,
      doctor: doctorId,
      status: 'completed'
    });

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: 'You can only write a review for doctors you have had a completed consultation with.'
      });
    }

    // Check if patient already reviewed this doctor
    const existingReview = await Review.findOne({
      patient: req.user.id,
      doctor: doctorId
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this doctor.' });
    }

    const review = await Review.create({
      patient: req.user.id,
      doctor: doctorId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (err) {
    next(err);
  }
};
