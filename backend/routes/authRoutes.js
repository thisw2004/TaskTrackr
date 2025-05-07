
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters').isLength({ min: 8 })
  ],
  authController.register
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// Get current user
router.get('/me', auth, authController.getMe);

// Verify email
router.get('/verify/:token', authController.verifyEmail);

// Forgot password
router.post(
  '/forgotpassword',
  [check('email', 'Please include a valid email').isEmail()],
  authController.forgotPassword
);

module.exports = router;