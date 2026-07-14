const mongoose = require('mongoose');

const TrackerLogsSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['diet', 'workout', 'activity', 'reminder', 'symptom', 'doctor_note']
  },
  date: {
    type: String, // YYYY-MM-DD
    default: () => new Date().toISOString().split('T')[0]
  },
  // Sub-fields for specific categories
  diet: {
    mealName: { type: String },
    calories: { type: Number },
    carbs: { type: Number },
    protein: { type: Number },
    fat: { type: Number }
  },
  workout: {
    workoutName: { type: String },
    duration: { type: Number }, // in minutes
    caloriesBurned: { type: Number },
    intensity: { type: String }
  },
  activity: {
    waterIntake: { type: Number, default: 0 }, // in ml
    sleepDuration: { type: Number, default: 0 }, // in hours
    caloriesTarget: { type: Number, default: 0 }
  },
  reminder: {
    details: { type: String },
    type: { type: String }, // 'medication' or 'appointment'
    time: { type: String } // e.g., '09:00 AM'
  },
  symptom: {
    symptomsList: { type: [String], default: [] },
    severity: { type: Number, min: 1, max: 10 },
    duration: { type: String },
    frequency: { type: String },
    wellbeing: { type: Number },
    notes: { type: String },
    vitals: {
      bloodPressure: { type: String },
      heartRate: { type: Number },
      temperature: { type: Number },
      weight: { type: Number }
    }
  },
  doctorNote: {
    doctorEmail: { type: String },
    notes: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for query optimization
TrackerLogsSchema.index({ userEmail: 1, category: 1, date: -1 });

module.exports = mongoose.model('TrackerLogs', TrackerLogsSchema);
