const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getActivities,
  logActivity,
  getReminders,
  addReminder,
  deleteReminder,
  getDietLogs,
  logMeal,
  getWorkoutLogs,
  logWorkout,
  getPatients,
  getPatientData,
  patientNotes,
  askAI,
  generateDiet,
  analyzeDrugs,
  checkSymptoms,
  getWeeklyActivities
} = require('../controllers/trackerController');

// 1. User Tracker Router
const userTrackerRouter = express.Router();
userTrackerRouter.use(protect);
userTrackerRouter.get('/activities/weekly', getWeeklyActivities);
userTrackerRouter.route('/activities').get(getActivities).post(logActivity);
userTrackerRouter.route('/reminders').get(getReminders).post(addReminder).delete(deleteReminder);
userTrackerRouter.route('/diet-logs').get(getDietLogs).post(logMeal);
userTrackerRouter.route('/workout-logs').get(getWorkoutLogs).post(logWorkout);

// 2. Doctor Tracker Router
const doctorTrackerRouter = express.Router();
doctorTrackerRouter.use(protect);
doctorTrackerRouter.use(authorize('doctor'));
doctorTrackerRouter.get('/patients', getPatients);
doctorTrackerRouter.get('/patient/:email/data', getPatientData);
doctorTrackerRouter.route('/patient/:email/notes').get(patientNotes).post(patientNotes);

// 3. Shared Utility Router
const sharedTrackerRouter = express.Router();
sharedTrackerRouter.use(protect);
sharedTrackerRouter.post('/askAI', askAI);
sharedTrackerRouter.post('/generate-diet-plan', generateDiet);
sharedTrackerRouter.post('/analyze-drugs', analyzeDrugs);
sharedTrackerRouter.post('/symptoms', checkSymptoms);

module.exports = {
  userTrackerRouter,
  doctorTrackerRouter,
  sharedTrackerRouter
};
