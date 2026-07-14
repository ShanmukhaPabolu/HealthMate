const express = require('express');
const router = express.Router();
const { getDashboardStats, approveDoctor, rejectDoctor, toggleDoctorSuspension, getPatients, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply admin access restriction to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.patch('/doctors/:id/approve', approveDoctor);
router.delete('/doctors/:id/reject', rejectDoctor);
router.patch('/doctors/:id/suspend', toggleDoctorSuspension);
router.get('/patients', getPatients);
router.delete('/users/:id', deleteUser);

module.exports = router;
