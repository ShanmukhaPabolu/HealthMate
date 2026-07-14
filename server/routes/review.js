const express = require('express');
const router = express.Router();
const { getReviews, addReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const { check } = require('express-validator');
const { validate } = require('../middleware/validation');

// GET /api/reviews?doctorId=X — public, paginated
router.get('/', getReviews);

// POST /api/reviews — patient only, with validation
router.post(
  '/',
  protect,
  authorize('patient'),
  [
    check('doctorId', 'Doctor ID is required').notEmpty(),
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').notEmpty().trim(),
    validate
  ],
  addReview
);

module.exports = router;
