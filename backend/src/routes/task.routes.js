const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authController = require('../controllers/auth.controller');

// Apply authentication middleware to all task routes
router.use(authController.authenticate);

// Get all tasks for current user
router.get('/', taskController.getAllTasks);

// Get a specific task by ID
router.get('/:id', taskController.getTaskById);

// Create a new task
router.post('/', taskController.createTask);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Mark a task as completed
router.patch('/:id/complete', taskController.markAsCompleted);

// Search tasks
router.get('/search/:keyword', taskController.searchTasks);

module.exports = router;
