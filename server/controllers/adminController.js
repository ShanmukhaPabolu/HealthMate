const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

// @desc    Get admin dashboard metrics & analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const approvedDoctors = await Doctor.countDocuments({ approved: true });
    const pendingDoctors = await Doctor.countDocuments({ approved: false });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    
    // Revenue calculations
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    // Fetch lists
    const pendingApprovalDoctors = await Doctor.find({ approved: false })
      .populate('user', 'name email phone createdAt');

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalDoctors,
          approvedDoctors,
          pendingDoctors,
          totalPatients,
          totalAppointments,
          totalRevenue
        },
        pendingApprovalDoctors,
        recentAppointments
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a doctor registration
// @route   PATCH /api/admin/doctors/:id/approve
// @access  Private (Admin only)
exports.approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    doctor.approved = true;
    doctor.isVerified = true;
    await doctor.save();

    // Send verification success notification/email
    const user = await User.findById(doctor.user);
    // Send email using transporter... (optional log)
    
    res.status(200).json({
      success: true,
      message: 'Doctor approved successfully',
      data: doctor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject / Delete a doctor registration
// @route   DELETE /api/admin/doctors/:id/reject
// @access  Private (Admin only)
exports.rejectDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Revert user credentials role to patient or delete user
    await User.findByIdAndUpdate(doctor.user, { role: 'patient' });
    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Doctor registration rejected successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Suspend / Unsuspend Doctor
// @route   PATCH /api/admin/doctors/:id/suspend
// @access  Private (Admin only)
exports.toggleDoctorSuspension = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    doctor.suspended = !doctor.suspended;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Doctor suspension status set to: ${doctor.suspended}`,
      data: doctor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Manage patients - List all patients
// @route   GET /api/admin/patients
// @access  Private (Admin only)
exports.getPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: 'patient' }).sort('-createdAt');
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a patient/user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If doctor, delete profile first
    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ user: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
