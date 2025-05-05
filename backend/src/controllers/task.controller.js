const Task = require('../models/task.model');

// Get all tasks for current user
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

// Get a specific task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error while fetching task' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    
    // Validate input
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      user: req.user._id
    });
    
    await newTask.save();
    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    
    // Find task and verify ownership
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update task fields
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.deadline = deadline || task.deadline;
    task.priority = priority || task.priority;
    
    await task.save();
    
    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const result = await Task.deleteOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

// Mark a task as completed
exports.markAsCompleted = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.completed = !task.completed; // Toggle completion status
    await task.save();
    
    res.status(200).json({
      message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`,
      task
    });
  } catch (error) {
    console.error('Error updating completion status:', error);
    res.status(500).json({ message: 'Server error while updating completion status' });
  }
};

// Search tasks
exports.searchTasks = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    
    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ message: 'Search keyword is required' });
    }
    
    const tasks = await Task.find({
      user: req.user._id,
      $text: { $search: keyword }
    }).sort({ createdAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error searching tasks:', error);
    res.status(500).json({ message: 'Server error while searching tasks' });
  }
};
