import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskEditDialogComponent } from '../task-edit-dialog/task-edit-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  errorMessage: string = '';
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  searchTerm: string = '';
  filteredTasks: any[] = [];

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
        console.log('Tasks loaded from API:', data); // Debug log
        this.tasks = data;
        this.applyFilter();
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

  getFilteredTasks(): any[] {
    let filtered: any[];
    
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
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.filterStatus === 'all' || 
        (this.filterStatus === 'active' && !task.completed) ||
        (this.filterStatus === 'completed' && task.completed);
        
      return matchesSearch && matchesStatus;
    });
    console.log('After filtering:', this.filteredTasks.length, 'tasks remain');
  }

  searchTasks(term: string): void {
    this.searchTerm = term;
    this.applyFilter();
  }

  toggleTaskStatus(task: any): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        task.completed = !task.completed;
      },
      error: (err) => {
        console.error('Error updating task status:', err);
        this.errorMessage = 'Failed to update task. Please try again.';
      }
    });
  }

  toggleComplete(task: any): void {
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
          },
          error: (err) => {
            console.error('Error adding task:', err);
            this.errorMessage = 'Failed to add task. Please try again.';
          }
        });
      }
    });
  }

  editTask(task: any): void {
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
        // Preserve the original ID
        result._id = task._id;
        
        this.taskService.updateTask(result).subscribe({
          next: (updatedTask) => {
            // Explicitly set the text color properties
            const mergedTask = {
              ...updatedTask,
              completed: updatedTask.completed || task.completed // Preserve completed state
            };
            
            const index = this.tasks.findIndex(t => t._id === task._id);
            if (index !== -1) {
              this.tasks[index] = mergedTask;
              
              // Force refresh of the task list
              this.tasks = [...this.tasks];
              this.applyFilter(); // Apply filters after editing a task
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

  deleteTask(task: any): void {
    if (confirm('Are you sure you want to delete this task?')) {
      const id = task._id; // Make sure we're using the correct ID
      
      console.log('Attempting to delete task:', task);
      
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log('Delete successful in component');
          // Update local array to remove deleted task
          this.tasks = this.tasks.filter(t => t._id !== id);
          this.applyFilter(); // Apply filters after deleting a task
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
}