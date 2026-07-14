const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

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
