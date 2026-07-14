const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

// @desc    Register a doctor profile (pending approval)
// @route   POST /api/doctors/register
// @access  Public
exports.registerDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      hospital,
      clinic,
      bio,
      languages,
      availableDays,
      availableSlots,
      profilePhoto,
      location
    } = req.body;

    // Check if email already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create User credentials
    user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'doctor'
    });

    // Create Doctor Profile (approved: false by default)
    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      qualification,
      experience,
      consultationFee,
      hospital,
      clinic: clinic || '',
      bio: bio || '',
      languages: languages || ['English'],
      availableDays: availableDays || [],
      availableSlots: availableSlots || [],
      profilePhoto: profilePhoto || '',
      location: location || { address: '', latitude: 0, longitude: 0 },
      approved: false
    });

    res.status(201).json({
      success: true,
      message: 'Doctor registration request submitted. Waiting for admin approval.',
      data: doctor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all approved doctors with search, filters and sorting
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    const {
      search,
      specialization,
      experience,
      rating,
      feeMin,
      feeMax,
      hospital,
      gender,
      availability,
      location,
      sort
    } = req.query;

    const query = { approved: true, suspended: false };

    // Search by doctor name or specialization or symptoms
    if (search) {
      // Find matching user IDs first
      const users = await User.find({
        name: { $regex: search, $options: 'i' },
        role: 'doctor'
      });
      const userIds = users.map(u => u._id);
      
      query.$or = [
        { user: { $in: userIds } },
        { specialization: { $regex: search, $options: 'i' } },
        { hospital: { $regex: search, $options: 'i' } },
        { clinic: { $regex: search, $options: 'i' } }
      ];
    }

    if (specialization) {
      query.specialization = specialization;
    }

    if (experience) {
      query.experience = { $gte: parseInt(experience) };
    }

    if (rating) {
      query.ratings = { $gte: parseFloat(rating) };
    }

    if (feeMin || feeMax) {
      query.consultationFee = {};
      if (feeMin) query.consultationFee.$gte = parseInt(feeMin);
      if (feeMax) query.consultationFee.$lte = parseInt(feeMax);
    }

    if (hospital) {
      query.hospital = { $regex: hospital, $options: 'i' };
    }

    if (availability) {
      query.availableDays = availability; // e.g. 'Monday'
    }

    if (location) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'location.address': { $regex: location, $options: 'i' } },
        { hospital: { $regex: location, $options: 'i' } },
        { clinic: { $regex: location, $options: 'i' } }
      );
    }

    // Filter by gender (requires querying user collection)
    if (gender) {
      const users = await User.find({ gender, role: 'doctor' });
      const userIds = users.map(u => u._id);
      query.user = { $in: userIds };
    }

    // Build query execution
    let dbQuery = Doctor.find(query).populate('user', 'name email phone gender profileImage');

    // Sorting options
    if (sort) {
      switch (sort) {
        case 'popularity':
          dbQuery = dbQuery.sort('-totalPatients');
          break;
        case 'highest-rated':
          dbQuery = dbQuery.sort('-ratings');
          break;
        case 'lowest-fee':
          dbQuery = dbQuery.sort('consultationFee');
          break;
        case 'highest-fee':
          dbQuery = dbQuery.sort('-consultationFee');
          break;
        case 'most-experienced':
          dbQuery = dbQuery.sort('-experience');
          break;
        case 'newest':
          dbQuery = dbQuery.sort('-createdAt');
          break;
        default:
          dbQuery = dbQuery.sort('-ratings');
      }
    } else {
      dbQuery = dbQuery.sort('-ratings'); // default
    }

    const doctors = await doctorsQueryExecutor(dbQuery);
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    next(err);
  }
};

const doctorsQueryExecutor = async (dbQuery) => {
  return await dbQuery;
};

// @desc    Get doctor details by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone gender bio profileImage');
      
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Fetch reviews
    const reviews = await Review.find({ doctor: doctor._id })
      .populate('patient', 'name profileImage')
      .sort('-createdAt');

    // Fetch related doctors with same specialization (max 4)
    const relatedDoctors = await Doctor.find({
      specialization: doctor.specialization,
      _id: { $ne: doctor._id },
      approved: true
    })
    .populate('user', 'name profileImage')
    .limit(4);

    res.status(200).json({
      success: true,
      data: {
        doctor,
        reviews,
        relatedDoctors
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update doctor profile (availability, slots, leaves, details)
// @route   PATCH /api/doctors/profile
// @access  Private (Doctor only)
exports.updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const {
      specialization,
      qualification,
      experience,
      consultationFee,
      hospital,
      clinic,
      bio,
      languages,
      availableDays,
      availableSlots,
      profilePhoto,
      location,
      leaves
    } = req.body;

    const fieldsToUpdate = {
      specialization,
      qualification,
      experience,
      consultationFee,
      hospital,
      clinic,
      bio,
      languages,
      availableDays,
      availableSlots,
      profilePhoto,
      location,
      leaves
    };

    // Clean undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedDoctor
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Doctor Dashboard Analytics
// @route   GET /api/doctors/dashboard
// @access  Private (Doctor only)
exports.getDoctorDashboard = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor details not found' });
    }

    // Fetch upcoming appointments
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone gender profileImage')
      .sort('-date');

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

    // Calculate revenue
    const completedApptIds = appointments.filter(a => a.status === 'completed' && a.paymentStatus === 'paid').map(a => a._id);
    const consultationFee = doctor.consultationFee;
    const totalEarnings = completedApptIds.length * consultationFee;

    // Build monthly earnings
    const monthlyEarnings = completedApptIds.length * consultationFee; // Mock calculation simplified for dashboard metrics

    res.status(200).json({
      success: true,
      data: {
        doctor,
        stats: {
          totalAppointments,
          completedAppointments,
          pendingAppointments,
          totalPatients: doctor.totalPatients,
          totalEarnings,
          monthlyEarnings,
          ratings: doctor.ratings,
          reviewsCount: doctor.reviewsCount
        },
        appointments
      }
    });
  } catch (err) {
    next(err);
  }
};
