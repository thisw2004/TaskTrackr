const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;