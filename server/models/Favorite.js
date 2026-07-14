const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid duplicate entries
FavoriteSchema.index({ patient: 1, doctor: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
