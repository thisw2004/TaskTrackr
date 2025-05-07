import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Task } from '../../models/task.model';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
  upcomingTasks: Task[] = [];
  completedTasks: Task[] = [];
  overdueTasks: Task[] = [];
  recentlyCompletedTasks: Task[] = [];
  
  loading = {
    upcoming: true,
    completed: true
  };
  
  error = '';
  currentUser: User | null = null;
  today: Date = new Date();
  private subscriptions: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTasks();
    
    this.subscriptions.add(
      this.authService.user$.subscribe({
        next: (user: User | null) => {
          this.currentUser = user;
          if (!user) {
            this.router.navigate(['/login']);
          }
        },
        error: (error: Error) => {
          console.error('Error fetching user profile:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTasks(): void {
    // Load upcoming tasks (TODO, IN_PROGRESS, BLOCKED)
    this.loading.upcoming = true;
    this.subscriptions.add(
      this.taskService.getTasks().subscribe({
        next: (tasks: Task[]) => {
          // Process tasks
          this.upcomingTasks = tasks.filter(task => 
            task.status !== 'DONE' && 
            (!task.dueDate || new Date(task.dueDate) >= this.today)
          );
          
          this.overdueTasks = tasks.filter(task => 
            task.status !== 'DONE' && 
            task.dueDate && new Date(task.dueDate) < this.today
          );
          
          this.recentlyCompletedTasks = tasks.filter(task => 
            task.status === 'DONE'
          ).slice(0, 5); // Show only last 5 completed tasks
          
          // Add isCompleted property
          this.upcomingTasks.forEach(task => task.isCompleted = false);
          this.overdueTasks.forEach(task => task.isCompleted = false);
          this.recentlyCompletedTasks.forEach(task => task.isCompleted = true);
          
          // For template compatibility
          this.upcomingTasks.forEach(task => task.deadline = task.dueDate);
          this.overdueTasks.forEach(task => task.deadline = task.dueDate);
          
          this.loading.upcoming = false;
          this.loading.completed = false;
        },
        error: (err: Error) => {
          console.error('Error loading tasks:', err);
          this.error = 'Failed to load tasks. Please try again.';
          this.loading.upcoming = false;
          this.loading.completed = false;
        }
      })
    );
  }

  toggleTaskCompletion(task: Task): void {
    // Fix: Cast the string to the correct literal type
    const newStatus = task.isCompleted ? 'TODO' as const : 'DONE' as const;
    
    // Create a copy of the task with the proper type for status
    const updatedTask: Partial<Task> = {
      ...task,
      status: newStatus
    };
    
    this.subscriptions.add(
      this.taskService.updateTask(task.id || task._id || '', updatedTask).subscribe({
        next: () => {
          this.loadTasks(); // Reload tasks after update
        },
        error: (err: Error) => {
          console.error('Error updating task:', err);
          // Revert the toggle if there was an error
          task.isCompleted = !task.isCompleted;
        }
      })
    );
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'No date set';
    return this.datePipe.transform(date, 'MMM d, y') || 'Invalid date';
  }
}