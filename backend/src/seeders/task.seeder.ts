import { DataSource } from 'typeorm';
import { Task } from '../entities/task.entity';

class TaskSeeder {
  static async seed(dataSource: DataSource, count: number = 10): Promise<void> {
    const taskRepository = dataSource.getRepository(Task);
    
    console.log(`Seeding ${count} tasks...`);
    
    // Generate and save tasks
    const tasks = [];
    
    const statuses = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    
    for (let i = 0; i < count; i++) {
      const task = new Task();
      task.title = `Task ${i + 1}`;
      task.description = `Description for task ${i + 1}. This is a sample task created by the seeder.`;
      task.status = statuses[Math.floor(Math.random() * statuses.length)];
      task.priority = priorities[Math.floor(Math.random() * priorities.length)];
      task.dueDate = new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000); // Random due date within next 30 days
      task.createdAt = new Date();
      task.updatedAt = new Date();
      
      tasks.push(task);
    }
    
    // Save all tasks to the database
    await taskRepository.save(tasks);
    
    console.log(`Successfully seeded ${count} tasks`);
  }
}

export default TaskSeeder;