const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  tags: [String],
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for searching tasks by title and description
TaskSchema.index({ title: 'text', description: 'text' });

// Virtual for checking if task is overdue
TaskSchema.virtual('isOverdue').get(function() {
  return !this.isCompleted && this.deadline < new Date();
});

// Pre save hook to handle any task creation logic
TaskSchema.pre('save', function(next) {
  // If task is being marked as complete, set the completedAt date
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', TaskSchema);