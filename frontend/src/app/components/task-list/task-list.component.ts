import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskEditDialogComponent } from '../task-edit-dialog/task-edit-dialog.component';

// Complete the interface
interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  deadline?: Date;
  dueDate?: Date;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading: boolean = false;
  error: string | null = null;
  errorMessage: string = '';
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  searchTerm: string = '';
  filteredTasks: Task[] = [];
  taskStats = {
    total: 0,
    completed: 0,
    active: 0
  };

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    
    this.taskService.getTasks().subscribe({
      next: (data) => {
        console.log('Tasks loaded from API:', data); 
        this.tasks = data;
        this.filteredTasks = [...this.tasks]; // Initialize with all tasks
        this.applyFilter(); // Then apply any filters
        this.updateTaskStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.errorMessage = 'Unable to load tasks. Please try again later.';
        this.error = this.errorMessage;
        this.loading = false;
      }
    });
  }

  setFilter(status: 'all' | 'active' | 'completed'): void {
    this.filterStatus = status;
    this.applyFilter(); // Apply filters when filter changes
  }

  getFilteredTasks(): Task[] {
    let filtered: Task[];
    
    switch (this.filterStatus) {
      case 'active':
        filtered = this.tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = this.tasks.filter(task => task.completed);
        break;
      default:
        filtered = [...this.tasks];
    }
    
    this.filteredTasks = filtered; // Update filteredTasks
    return filtered;
  }

  applyFilter(): void {
    this.filteredTasks = this.tasks.filter(task => {
      // Check what conditions are filtering out your tasks
      const matchesSearch = !this.searchTerm || 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.filterStatus === 'all' || 
        (this.filterStatus === 'active' && !task.completed) ||
        (this.filterStatus === 'completed' && task.completed);
        
      return matchesSearch && matchesStatus;
    });
    console.log('After filtering:', this.filteredTasks.length, 'tasks remain');
    this.updateTaskStats();
  }

  searchTasks(term: string): void {
    this.searchTerm = term;
    this.applyFilter();
  }

  toggleTaskStatus(task: Task): void {
    const updatedTask = { completed: !task.completed };
    this.taskService.updateTask(task._id, updatedTask).subscribe({
      next: () => {
        task.completed = !task.completed;
        this.updateTaskStats();
      },
      error: (err) => {
        console.error('Error updating task status:', err);
        this.errorMessage = 'Failed to update task. Please try again.';
      }
    });
  }

  toggleComplete(task: Task): void {
    this.toggleTaskStatus(task);
  }

  addTask(): void {
    console.log('Add new task called');
    
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { title: '', description: '', dueDate: new Date() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addTask(result).subscribe({
          next: (newTask) => {
            console.log('Task added successfully', newTask);
            this.tasks.push(newTask);
            this.errorMessage = '';
            this.applyFilter(); // Apply filters after adding a task
            this.updateTaskStats();
          },
          error: (err) => {
            console.error('Error adding task:', err);
            this.errorMessage = 'Failed to add task. Please try again.';
          }
        });
      }
    });
  }

  editTask(task: Task): void {
    const taskToEdit = { 
      ...task,
      dueDate: task.deadline 
    };
    
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: taskToEdit
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Get the ID from the original task
        const taskId = task._id;
        // Remove the _id from the result to avoid sending it in the payload
        const { _id, ...taskData } = result;
        
        this.taskService.updateTask(taskId, taskData).subscribe({
          next: (updatedTask) => {
            // Rest of the code remains the same
            const mergedTask: Task = {
              ...task, // Ensure required properties (_id, title, description) are included
              ...updatedTask,
              completed: 'completed' in updatedTask ? updatedTask.completed as boolean : task.completed
            };
            
            const index = this.tasks.findIndex(t => t._id === task._id);
            if (index !== -1) {
              this.tasks[index] = mergedTask;
              
              this.tasks = [...this.tasks];
              this.applyFilter();
              this.updateTaskStats();
            }
            
            this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error updating task:', err);
            this.snackBar.open('Failed to update task', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm('Are you sure you want to delete this task?')) {
      const id = task._id; // Make sure we're using the correct ID
      
      console.log('Attempting to delete task:', task);
      
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log('Delete successful in component');
          // Update local array to remove deleted task
          this.tasks = this.tasks.filter(t => t._id !== id);
          this.applyFilter(); // Apply filters after deleting a task
          this.updateTaskStats();
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          this.snackBar.open('Failed to delete task: ' + err.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  addNewTask(): void {
    this.addTask();
  }

  updateTaskStats(): void {
    this.taskStats.total = this.tasks.length;
    this.taskStats.completed = this.tasks.filter(task => task.completed).length;
    this.taskStats.active = this.tasks.filter(task => !task.completed).length;
  }
}