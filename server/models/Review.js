const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update average doctor rating after review is saved
ReviewSchema.post('save', async function() {
  const Doctor = mongoose.model('Doctor');
  const reviewCountObj = await this.constructor.aggregate([
    { $match: { doctor: this.doctor } },
    { $group: { _id: '$doctor', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  if (reviewCountObj.length > 0) {
    await Doctor.findByIdAndUpdate(this.doctor, {
      ratings: Math.round(reviewCountObj[0].averageRating * 10) / 10,
      reviewsCount: reviewCountObj[0].count
    });
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
