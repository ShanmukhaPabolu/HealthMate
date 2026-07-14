const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, updateAppointment, downloadReceipt, downloadPrescription, getBookedSlots } = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { appointmentRules } = require('../middleware/validation');
const upload = require('../middleware/upload');

router.get('/booked-slots', protect, getBookedSlots);

router.route('/')
  .get(protect, getAppointments)
  .post(protect, upload.single('report'), appointmentRules, bookAppointment);

router.route('/:id')
  .patch(protect, updateAppointment);

router.get('/:id/receipt', protect, downloadReceipt);
router.get('/:id/prescription', protect, downloadPrescription);

module.exports = router;
