const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  against: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Doctor or patient involved
  },
  category: {
    type: String,
    enum: ['Billing', 'Cancellation', 'Medical Quality', 'Discharge', 'Behavior', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    required: [true, 'Please add a dispute description']
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'resolved'],
    default: 'pending'
  },
  resolutionNotes: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dispute', DisputeSchema);
