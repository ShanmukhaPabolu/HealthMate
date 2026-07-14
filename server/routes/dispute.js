const express = require('express');
const router = express.Router();
const { createDispute, getDisputes, resolveDispute } = require('../controllers/disputeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createDispute)
  .get(getDisputes);

router.patch('/:id/resolve', authorize('admin'), resolveDispute);

module.exports = router;
