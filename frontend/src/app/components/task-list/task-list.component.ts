import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  filterStatus: 'all' | 'active' | 'completed' = 'all';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load tasks. Please try again.';
        console.error('Error loading tasks:', error);
        this.loading = false;
      }
    );
  }

  getFilteredTasks(): Task[] {
    switch (this.filterStatus) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  toggleTaskStatus(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task.id, task).subscribe(
      () => {
        // Task updated successfully
      },
      (error) => {
        // Revert the change if the update fails
        task.completed = !task.completed;
        this.errorMessage = 'Failed to update task status. Please try again.';
        console.error('Error updating task:', error);
      }
    );
  }

  deleteTask(task: Task): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.id).subscribe(
        () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
        },
        (error) => {
          this.errorMessage = 'Failed to delete task. Please try again.';
          console.error('Error deleting task:', error);
        }
      );
    }
  }

  setFilter(status: 'all' | 'active' | 'completed'): void {
    this.filterStatus = status;
  }
}