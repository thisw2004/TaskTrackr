const Task = require('../models/task.model');
const User = require('../models/user.model');

// Check for tasks with approaching deadlines and prepare notifications
exports.checkAndSendReminders = async () => {
  try {
    console.log('Checking for task reminders...');
    
    // Find tasks with deadlines within the next 24 hours that are not completed
    const now = new Date();
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setHours(now.getHours() + 24);
    
    const tasks = await Task.find({
      deadline: { $gte: now, $lte: oneDayFromNow },
      completed: false
    }).populate('user', 'name email');
    
    if (tasks.length === 0) {
      console.log('No upcoming deadlines to notify about');
      return;
    }
    
    console.log(`Found ${tasks.length} tasks with approaching deadlines`);
    
    // In a real application, you would send emails or push notifications here
    // For this example, we'll just log the reminders
    for (const task of tasks) {
      console.log(`Reminder needed for task: ${task.title}, User: ${task.user.name}, Deadline: ${task.deadline}`);
      
      // Example notification logic (would be replaced by actual notification service)
      // await sendEmail(task.user.email, 'TaskTrackr Reminder', 
      //   `Your task "${task.title}" is due on ${task.deadline.toLocaleString()}`);
    }
    
    console.log('Reminders processed successfully');
  } catch (error) {
    console.error('Error processing reminders:', error);
  }
};

// Helper function to calculate hours until deadline
exports.getHoursUntilDeadline = (deadline) => {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
};
