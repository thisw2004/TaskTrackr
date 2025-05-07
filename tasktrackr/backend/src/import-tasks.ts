import { DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import * as fs from 'fs';
import * as path from 'path';

// Create a new data source with hardcoded database configuration
const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "tasktrackr",
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function importTasks() {
  try {
    // Initialize connection
    await dataSource.initialize();
    console.log("Database connection established");

    const taskRepository = dataSource.getRepository(Task);
    
    // Read tasks from JSON file
    const tasksData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'tasks.json'), 'utf8')
    );
    
    console.log(`Importing ${tasksData.length} tasks...`);
    
    // Map JSON data to Task entities
    const tasks = tasksData.map((taskData: any) => {
      const task = new Task();
      task.title = taskData.title;
      task.description = taskData.description;
      task.status = taskData.status;
      task.priority = taskData.priority;
      task.dueDate = new Date(taskData.dueDate);
      task.createdAt = new Date();
      task.updatedAt = new Date();
      return task;
    });
    
    // Save all tasks to the database
    await taskRepository.save(tasks);
    
    console.log(`Successfully imported ${tasks.length} tasks`);

    // Close connection
    await dataSource.destroy();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error during import:", error);
    process.exit(1);
  }
}

// Run the import function
importTasks();
