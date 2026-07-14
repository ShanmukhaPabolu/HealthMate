const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Please add qualifications'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add consultation fee']
  },
  hospital: {
    type: String,
    required: [true, 'Please add hospital name'],
    trim: true
  },
  clinic: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  languages: {
    type: [String],
    default: ['English']
  },
  availableDays: {
    type: [String], // e.g., ['Monday', 'Tuesday', 'Wednesday']
    default: []
  },
  availableSlots: {
    type: [String], // e.g., ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM']
    default: []
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  ratings: {
    type: Number,
    default: 5.0,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  location: {
    address: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  approved: {
    type: Boolean,
    default: false // Admin must approve doctor registration
  },
  suspended: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  leaves: {
    type: [Date], // Dates on which doctor is on leave
    default: []
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
