import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskEditDialogComponent } from '../task-edit-dialog/task-edit-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  allTasks: any[] = [];
  filteredTasks: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  errorMessage: string = '';
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  searchTerm: string = '';
  taskStats = {
    total: 0,
    completed: 0,
    active: 0
  };
  priorityFilter: string = 'all';

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
        this.allTasks = [...this.tasks];
        this.filteredTasks = [...this.tasks]; // Initialize with all tasks
        this.applyFilters(); // Then apply any filters
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
    this.applyFilters(); // Apply filters when filter changes
  }

  setPriorityFilter(priority: string): void {
    this.priorityFilter = priority;
    this.applyFilters();
  }

  applyFilters(): void {
    // First filter by status
    let result = this.tasks;
    
    // Apply status filter
    if (this.filterStatus === 'active') {
      result = result.filter(task => !task.completed);
    } else if (this.filterStatus === 'completed') {
      result = result.filter(task => task.completed);
    }
    
    // Then apply priority filter
    if (this.priorityFilter !== 'all') {
      result = result.filter(task => task.priority === this.priorityFilter);
    }
    
    this.filteredTasks = result;
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
    this.updateTaskStats();
  }

  applySearch(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredTasks = this.allTasks;
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    this.filteredTasks = this.allTasks.filter(task => 
      task.title.toLowerCase().includes(searchTermLower) || 
      (task.description && task.description.toLowerCase().includes(searchTermLower))
    );
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
        this.updateTaskStats();
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
            this.allTasks.push(newTask);
            this.errorMessage = '';
            this.applyFilters(); // Apply filters after adding a task
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
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: {
        isEdit: true,
        task: task
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(result).subscribe({
          next: () => {
            this.loadTasks();
            this.snackBar.open('Task updated successfully', 'Close', {
              duration: 3000
            });
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.snackBar.open('Failed to update task', 'Close', {
              duration: 3000
            });
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
          this.allTasks = this.allTasks.filter(t => t._id !== id);
          this.applyFilters(); // Apply filters after deleting a task
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