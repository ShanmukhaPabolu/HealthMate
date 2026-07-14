const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), addReview);

module.exports = router;
