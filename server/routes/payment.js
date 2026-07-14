const express = require('express');
const router = express.Router();
const { getPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPayments);

module.exports = router;
