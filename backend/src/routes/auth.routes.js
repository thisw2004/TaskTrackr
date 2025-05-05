const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user info
router.get('/me', authController.authenticate, authController.getCurrentUser);

module.exports = router;
