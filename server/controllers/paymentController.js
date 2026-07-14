const Payment = require('../models/Payment');
const Doctor = require('../models/Doctor');

// @desc    Get user billing history
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor details not found' });
      }
      // Appointments booked with this doctor
      const payments = await Payment.find()
        .populate({
          path: 'appointment',
          match: { doctor: doctor._id }
        })
        .populate('patient', 'name email');
      
      // Filter out payments not matching doctor appointments
      const doctorPayments = payments.filter(p => p.appointment !== null);
      return res.status(200).json({ success: true, count: doctorPayments.length, data: doctorPayments });
    }

    const payments = await Payment.find(query)
      .populate('appointment')
      .populate('patient', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    next(err);
  }
};
