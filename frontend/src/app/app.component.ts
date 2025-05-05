import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TaskTrackr';
  isLoggedIn = false;
  
  newTask: any = {};
  tasks: any[] = [];
  editingTask: any = null;
  minDate: string;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Set minimum date to today for deadline validation
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    // Check authentication status on init and when it changes
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    // Check authentication on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // If not on login or register pages and not logged in, redirect to login
      if (!this.isLoggedIn && 
          !this.router.url.includes('/login') && 
          !this.router.url.includes('/register')) {
        this.router.navigate(['/login']);
      }
    });
  }

  addTask() {
    // Generate unique ID for new task
    const id = this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
    
    // Create new task with form data
    const task = {
      id: id,
      title: this.newTask.title,
      description: this.newTask.description || '',
      deadline: this.newTask.deadline,
      completed: false,
      createdAt: new Date()
    };
    
    // Add task to list
    this.tasks.push(task);
    
    // Reset form
    this.newTask = {};
  }
  
  getActiveTasks() {
    // Return active tasks
    return this.tasks.filter(task => !task.completed);
  }

  getCompletedTasks() {
    // Return completed tasks
    return this.tasks.filter(task => task.completed);
  }
  
  isOverdue(task: any) {
    // Check if task is overdue
    return new Date(task.deadline) < new Date();
  }
  
  toggleComplete(task: any) {
    // Toggle task completion
    task.completed = !task.completed;
  }
  
  editTask(task: any) {
    // Set task for editing
    this.editingTask = {...task};
  }
  
  saveEditedTask() {
    // Find and update the task
    const index = this.tasks.findIndex(task => task.id === this.editingTask.id);
    if (index !== -1) {
      this.tasks[index] = {...this.editingTask};
    }
    
    // Clear editing state
    this.editingTask = null;
  }
  
  cancelEdit() {
    // Clear editing state
    this.editingTask = null;
  }
  
  deleteTask(id: number) {
    // Delete task implementation
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}