const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mailService = require('../services/mail');
const smsService = require('../services/sms');
const { generateReceiptPDF, generatePrescriptionPDF } = require('../services/pdf');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, slot, consultationType, symptoms, medicalReports, amount, paymentMethod } = req.body;

    const doctor = await Doctor.findById(doctorId).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check doctor availability for the date (checking leaves)
    const bookingDate = new Date(date);
    const isLeave = doctor.leaves.some(leaveDate => new Date(leaveDate).toDateString() === bookingDate.toDateString());
    if (isLeave) {
      return res.status(400).json({ success: false, message: 'Doctor is on leave on this date' });
    }

    // Check if slot is already booked for this doctor on this date
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: bookingDate,
      slot: slot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'This slot is already booked. Please choose another slot.' });
    }

    // Queue position calculation
    const appointmentsOnDay = await Appointment.countDocuments({
      doctor: doctorId,
      date: bookingDate,
      status: { $ne: 'cancelled' }
    });
    const queuePosition = appointmentsOnDay + 1;

    let reportList = [];
    if (req.file) {
      reportList.push({
        reportName: req.file.originalname,
        reportUrl: `/uploads/${req.file.filename}`
      });
    } else if (medicalReports) {
      reportList = Array.isArray(medicalReports) ? medicalReports : [medicalReports];
    }

    // Create Appointment
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date: bookingDate,
      slot,
      consultationType: consultationType || 'offline',
      symptoms,
      queuePosition,
      reports: reportList,
      paymentStatus: amount ? 'paid' : 'pending',
      status: 'pending'
    });

    // Handle Payment simulation
    let paymentRecord = null;
    if (amount) {
      const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      paymentRecord = await Payment.create({
        appointment: appointment._id,
        patient: req.user.id,
        amount,
        method: paymentMethod || 'card',
        status: 'completed',
        transactionId
      });
    }

    // Send Notifications
    await Notification.create({
      user: req.user.id,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.user.name} on ${bookingDate.toLocaleDateString()} at ${slot} has been successfully requested.`,
      type: 'appointment'
    });

    await Notification.create({
      user: doctor.user._id,
      title: 'New Appointment Request',
      message: `New appointment requested by ${req.user.name} for ${bookingDate.toLocaleDateString()} at ${slot}.`,
      type: 'appointment'
    });

    // Send Email via Nodemailer
    const apptDetails = {
      doctorName: `Dr. ${doctor.user.name}`,
      date: bookingDate.toLocaleDateString(),
      slot,
      consultationType: consultationType || 'offline'
    };
    await mailService.sendAppointmentUpdate(req.user.email, req.user.name, apptDetails, 'booked');

    if (req.user.phone) {
      await smsService.sendBookingConfirmationSMS(
        req.user.phone,
        req.user.name,
        doctor.user.name,
        bookingDate.toLocaleDateString(),
        slot
      );
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
      payment: paymentRecord
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get appointments (Patient or Doctor view)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }
      query.doctor = doctor._id;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email profilePhoto' }
      })
      .populate('patient', 'name email phone gender profileImage')
      .sort('-date');

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    next(err);
  }
};

// @desc    Update appointment status (doctor accepts/rejects/completes or patient cancels)
// @route   PATCH /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    const { status, prescription, notes } = req.body;
    let appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'doctor', populate: { path: 'user' } })
      .populate('patient');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Role specific modifications check
    const isPatientOwner = appointment.patient._id.toString() === req.user.id;
    const doctorObj = await Doctor.findOne({ user: req.user.id });
    const isDoctorOwner = doctorObj && appointment.doctor._id.toString() === doctorObj._id.toString();

    if (!isPatientOwner && !isDoctorOwner && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to modify this appointment' });
    }

    const previousStatus = appointment.status;

    if (status) {
      appointment.status = status;
      appointment.auditTrail.push({
        action: `Status changed from ${previousStatus} to ${status}`,
        changedBy: req.user.id
      });
      
      // Update Doctor total patients if marked completed
      if (status === 'completed' && previousStatus !== 'completed') {
        await Doctor.findByIdAndUpdate(appointment.doctor._id, { $inc: { totalPatients: 1 } });
      }
    }

    if (prescription) {
      appointment.prescription = {
        medicines: prescription.medicines || [],
        notes: prescription.notes || '',
        uploadedAt: new Date()
      };
      
      await Notification.create({
        user: appointment.patient._id,
        title: 'Prescription Uploaded',
        message: `Dr. ${appointment.doctor.user.name} has uploaded a digital prescription for your visit.`,
        type: 'prescription'
      });
    }

    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    // Trigger Notification and email for status change
    if (status) {
      const emailRecipient = req.user.id === appointment.patient._id.toString() ? appointment.doctor.user.email : appointment.patient.email;
      const recipientName = req.user.id === appointment.patient._id.toString() ? appointment.doctor.user.name : appointment.patient.name;
      
      await Notification.create({
        user: req.user.id === appointment.patient._id.toString() ? appointment.doctor.user._id : appointment.patient._id,
        title: `Appointment ${status}`,
        message: `Appointment on ${new Date(appointment.date).toLocaleDateString()} is marked as ${status}.`,
        type: status === 'cancelled' ? 'cancelled' : 'appointment'
      });

      const apptDetails = {
        doctorName: `Dr. ${appointment.doctor.user.name}`,
        date: new Date(appointment.date).toLocaleDateString(),
        slot: appointment.slot,
        consultationType: appointment.consultationType
      };

      await mailService.sendAppointmentUpdate(emailRecipient, recipientName, apptDetails, status);

      const recipientPhone = req.user.id === appointment.patient._id.toString() ? appointment.doctor.user.phone : appointment.patient.phone;
      if (recipientPhone) {
        await smsService.sendStatusUpdateSMS(
          recipientPhone,
          recipientName,
          new Date(appointment.date).toLocaleDateString(),
          appointment.slot,
          status
        );
      }
    }

    res.status(200).json({ success: true, message: 'Appointment updated successfully', data: appointment });
  } catch (err) {
    next(err);
  }
};

// @desc    Download payment receipt PDF
// @route   GET /api/appointments/:id/receipt
// @access  Private
exports.downloadReceipt = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('patient', 'name');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const payment = await Payment.findOne({ appointment: appointment._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${appointment._id}.pdf`);

    generateReceiptPDF(appointment, payment, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Download prescription PDF
// @route   GET /api/appointments/:id/prescription
// @access  Private
exports.downloadPrescription = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .populate('patient', 'name gender dob');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription-${appointment._id}.pdf`);

    generatePrescriptionPDF(appointment, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get booked slots for a doctor on a specific date
// @route   GET /api/appointments/booked-slots
// @access  Private
exports.getBookedSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ success: false, message: 'Please provide doctorId and date' });
    }

    const queryDate = new Date(date);
    
    const appointments = await Appointment.find({
      doctor: doctorId,
      date: queryDate,
      status: { $ne: 'cancelled' }
    }).select('slot');

    const bookedSlots = appointments.map(app => app.slot);

    res.status(200).json({
      success: true,
      bookedSlots
    });
  } catch (err) {
    next(err);
  }
};
