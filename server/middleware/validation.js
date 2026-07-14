const { validationResult, check } = require('express-validator');

// Validation results collector
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array().map(e => e.msg) });
  }
  next();
};

// Rules for Registering Patient
const registerRules = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  validate
];

// Rules for Login
const loginRules = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  validate
];

// Rules for booking appointments
const appointmentRules = [
  check('doctorId', 'Doctor ID is required').notEmpty(),
  check('date', 'Valid date is required').isISO8601().toDate(),
  check('slot', 'Consultation slot time is required').notEmpty(),
  check('symptoms', 'Symptoms description is required').notEmpty().trim(),
  check('consultationType', 'Consultation type must be online or offline').isIn(['online', 'offline']),
  validate
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  appointmentRules
};
