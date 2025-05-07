import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { DataSource } from 'typeorm';

export function taskRoutes(dataSource: DataSource) {
  const router = Router();
  const taskController = new TaskController(dataSource);

  // Get all tasks
  router.get('/', taskController.getAllTasks.bind(taskController));
  
  // Create new task
  router.post('/', taskController.createTask.bind(taskController));
  
  // Get task by ID
  router.get('/:id', taskController.getTaskById.bind(taskController));
  
  // Update task
  router.put('/:id', taskController.updateTask.bind(taskController));
  
  // Delete task
  router.delete('/:id', taskController.deleteTask.bind(taskController));

  return router;
}
