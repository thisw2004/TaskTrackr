import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  upcomingTasks: Task[] = [];
  overdueTasks: Task[] = [];
  recentlyCompletedTasks: Task[] = [];
  loading = {
    user: false,
    upcoming: false,
    overdue: false,
    completed: false
  };
  error: string | null = null;
  today = new Date();
  
  // Stats
  totalTasks = 0;
  completedTasks = 0;
  completionRate = 0;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadTaskData();
  }

  loadUserData(): void {
    this.loading.user = true;
    this.authService.user$.subscribe({
      next: user => {
        this.user = user;
        this.loading.user = false;
      },
      error: error => {
        console.error('Error loading user data:', error);
        this.loading.user = false;
      }
    });
  }

  loadTaskData(): void {
    // Load upcoming tasks (due in the next 3 days)
    this.loading.upcoming = true;
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    this.taskService.getTasks({ completed: false }).subscribe({
      next: response => {
        const allTasks = response.data;
        this.totalTasks = allTasks.length;
        
        // Filter for upcoming tasks
        this.upcomingTasks = allTasks.filter(task => {
          const deadline = new Date(task.deadline);
          return deadline <= threeDaysFromNow && deadline >= this.today;
        }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        
        // Filter for overdue tasks
        this.overdueTasks = allTasks.filter(task => {
          return new Date(task.deadline) < this.today;
        });
        
        this.loading.upcoming = false;
      },
      error: error => {
        console.error('Error loading upcoming tasks:', error);
        this.error = 'Failed to load task data';
        this.loading.upcoming = false;
      }
    });
    
    // Load recently completed tasks
    this.loading.completed = true;
    this.taskService.getTasks({ completed: true }).subscribe({
      next: response => {
        const completedTasks = response.data;
        this.completedTasks = completedTasks.length;
        
        if (this.totalTasks > 0) {
          this.completionRate = Math.round((this.completedTasks / this.totalTasks) * 100);
        }
        
        // Get 5 most recently completed tasks
        this.recentlyCompletedTasks = completedTasks
          .sort((a, b) => {
            const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
            const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 5);
        
        this.loading.completed = false;
      },
      error: error => {
        console.error('Error loading completed tasks:', error);
        this.loading.completed = false;
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  toggleTaskCompletion(task: Task): void {
    this.taskService.toggleTaskCompletion(task._id!).subscribe({
      next: () => {
        // Reload task data to reflect changes
        this.loadTaskData();
      },
      error: error => {
        console.error('Error toggling task completion:', error);
      }
    });
  }
}