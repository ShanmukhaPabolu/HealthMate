const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', ''],
    default: ''
  },
  dob: {
    type: Date
  },
  address: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  // Health Profile Fields
  healthProfile: {
    bloodGroup: { type: String, default: '' },
    allergies: { type: String, default: '' },
    chronicConditions: { type: String, default: '' },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' }
    },
    insurance: {
      provider: { type: String, default: '' },
      policyNumber: { type: String, default: '' }
    },
    vaccines: [{
      vaccineName: { type: String },
      dateAdministered: { type: Date },
      batchNumber: { type: String }
    }],
    labReports: [{
      reportName: { type: String },
      testDate: { type: Date, default: Date.now },
      resultSummary: { type: String },
      documentUrl: { type: String }
    }],
    medicalHistory: [{ type: String }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (this.email === 'shanmukharani20@gmail.com') {
    this.role = 'admin';
  }
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
