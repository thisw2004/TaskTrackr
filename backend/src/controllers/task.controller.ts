import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { Task } from '../entities/task.entity';

export class TaskController {
  private dataSource: DataSource;
  
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }
  
  async getAllTasks(req: Request, res: Response) {
    try {
      const taskRepository = this.dataSource.getRepository(Task);
      const tasks = await taskRepository.find({
        order: {
          createdAt: 'DESC'
        }
      });
      
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ message: 'Failed to fetch tasks', error });
    }
  }
  
  async createTask(req: Request, res: Response) {
    try {
      const taskRepository = this.dataSource.getRepository(Task);
      const { title, description, status, priority, dueDate } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      
      const task = new Task();
      task.title = title;
      task.description = description || '';
      task.status = status || 'TODO';
      task.priority = priority || 'MEDIUM';
      task.dueDate = dueDate ? new Date(dueDate) : null;
      
      const savedTask = await taskRepository.save(task);
      
      return res.status(201).json(savedTask);
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({ message: 'Failed to create task', error });
    }
  }
  
  async getTaskById(req: Request, res: Response) {
    try {
      const taskRepository = this.dataSource.getRepository(Task);
      const id = req.params.id;
      
      const task = await taskRepository.findOne({ where: { id } });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch task', error });
    }
  }
  
  async updateTask(req: Request, res: Response) {
    try {
      const taskRepository = this.dataSource.getRepository(Task);
      const id = req.params.id;
      const updateData = req.body;
      
      const task = await taskRepository.findOne({ where: { id } });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const updatedTask = {...task, ...updateData};
      await taskRepository.save(updatedTask);
      
      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update task', error });
    }
  }
  
  async deleteTask(req: Request, res: Response) {
    try {
      const taskRepository = this.dataSource.getRepository(Task);
      const id = req.params.id;
      
      const task = await taskRepository.findOne({ where: { id } });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      await taskRepository.remove(task);
      
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete task', error });
    }
  }
}
