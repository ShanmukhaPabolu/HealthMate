const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  consultationType: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  symptoms: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  prescription: {
    medicines: [{
      name: { type: String, required: true },
      dosage: { type: String, required: true }, // e.g., '1-0-1'
      duration: { type: String, required: true }, // e.g., '5 days'
      instructions: { type: String, default: '' } // e.g., 'After meal'
    }],
    notes: { type: String, default: '' },
    uploadedAt: { type: Date }
  },
  reports: [{
    reportName: { type: String },
    reportUrl: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: {
    type: String,
    default: ''
  },
  queuePosition: {
    type: Number,
    default: 0
  },
  auditTrail: [{
    action: { type: String },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
