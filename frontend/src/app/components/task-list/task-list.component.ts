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
    console.log('TaskListComponent initialized, loading tasks...');
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    
    this.taskService.getTasks().subscribe({
      next: (tasks: any[]) => {
        console.log('Received tasks:', tasks);
        
        if (!Array.isArray(tasks)) {
          console.error('Received invalid tasks data:', tasks);
          this.error = 'Invalid data received from server';
          this.loading = false;
          return;
        }

        this.tasks = tasks;
        this.allTasks = [...tasks];
        this.filteredTasks = [...tasks];
        this.applyFilters();
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
    this.applyFilters();
  }

  setPriorityFilter(priority: string): void {
    console.log('Setting priority filter to:', priority);
    this.priorityFilter = priority.toLowerCase(); // Ensure lowercase
    this.applyFilters();
  }

  applyFilters(): void {
    console.log('Applying filters. Priority:', this.priorityFilter);
    let result = this.tasks;
    
    // Apply status filter
    if (this.filterStatus === 'active') {
      result = result.filter(task => !task.completed);
    } else if (this.filterStatus === 'completed') {
      result = result.filter(task => task.completed);
    }
    
    // Apply priority filter
    if (this.priorityFilter !== 'all') {
      result = result.filter(task => {
        console.log('Task priority:', task.priority, 'Filter:', this.priorityFilter);
        // Skip tasks with no priority when filtering by specific priority
        if (!task.priority && this.priorityFilter !== 'none') {
          return false;
        }
        // Show tasks with no priority when filtering for 'none'
        if (this.priorityFilter === 'none') {
          return !task.priority;
        }
        // Normal priority comparison
        return task.priority && task.priority.toLowerCase() === this.priorityFilter.toLowerCase();
      });
    }
    
    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }
    
    console.log('Filtered tasks:', result.length);
    this.filteredTasks = result;
    this.updateTaskStats();
  }

  applySearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  searchTasks(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  toggleTaskStatus(task: any): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        task.completed = !task.completed;
        this.updateTaskStats();
        this.applyFilters(); // Reapply filters after status change
      },
      error: (err) => {
        console.error('Error updating task status:', err);
        this.errorMessage = 'Failed to update task. Please try again.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      }
    });
  }

  toggleComplete(task: any): void {
    this.toggleTaskStatus(task);
  }

  addTask(): void {
    console.log('Opening add task dialog');
    
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { title: '', description: '', dueDate: new Date() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addTask(result).subscribe({
          next: (newTask) => {
            console.log('Task added successfully:', newTask);
            this.tasks.push(newTask);
            this.allTasks.push(newTask);
            this.applyFilters();
            this.updateTaskStats();
            this.snackBar.open('Task added successfully', 'Close', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error adding task:', err);
            this.errorMessage = 'Failed to add task. Please try again.';
            this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  editTask(task: any): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { 
        isEdit: true,
        task: { ...task }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(result).subscribe({
          next: (updatedTask) => {
            const index = this.tasks.findIndex(t => t._id === updatedTask._id);
            if (index !== -1) {
              this.tasks[index] = updatedTask;
              this.allTasks = [...this.tasks];
              this.applyFilters();
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

  deleteTask(task: any): void {
    if (confirm('Are you sure you want to delete this task?')) {
      const id = task._id;
      
      console.log('Attempting to delete task:', task);
      
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log('Delete successful');
          this.tasks = this.tasks.filter(t => t._id !== id);
          this.allTasks = this.allTasks.filter(t => t._id !== id);
          this.applyFilters();
          this.updateTaskStats();
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          this.snackBar.open('Failed to delete task', 'Close', { duration: 3000 });
        }
      });
    }
  }

  addNewTask(): void {
    this.addTask();
  }

  updateTaskStats(): void {
    if (!this.tasks) return;
    
    this.taskStats.total = this.tasks.length;
    this.taskStats.completed = this.tasks.filter(task => task.completed).length;
    this.taskStats.active = this.tasks.filter(task => !task.completed).length;
  }
}