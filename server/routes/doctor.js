const express = require('express');
const router = express.Router();
const { registerDoctor, getDoctors, getDoctorById, updateDoctorProfile, getDoctorDashboard } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getDoctors)
  .post(registerDoctor);

router.get('/dashboard', protect, authorize('doctor'), getDoctorDashboard);
router.patch('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.get('/:id', getDoctorById);

module.exports = router;
