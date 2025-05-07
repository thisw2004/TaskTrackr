const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Search tasks
router.get('/search', taskController.searchTasks);

// Get upcoming deadlines
router.get('/deadlines', taskController.getUpcomingDeadlines);

// Get all tasks
router.get('/', taskController.getTasks);

// Get single task
router.get('/:id', taskController.getTask);

// Create task
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('deadline', 'Valid deadline date is required').isISO8601().toDate()
  ],
  taskController.createTask
);

// Update task
router.put(
  '/:id',
  [
    check('title', 'Title is required if provided').optional().not().isEmpty(),
    check('deadline', 'Valid deadline date is required if provided').optional().isISO8601().toDate()
  ],
  taskController.updateTask
);

// Delete task
router.delete('/:id', taskController.deleteTask);

// Toggle task completion
router.put('/:id/complete', taskController.toggleTaskCompletion);

module.exports = router;