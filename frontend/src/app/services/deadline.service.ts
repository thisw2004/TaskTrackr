import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  // Add other task properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class DeadlineService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';
  
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  /**
   * Check for tasks with approaching deadlines and show notifications
   */
  async checkUpcomingDeadlines(): Promise<void> {
    // Only check if user is logged in
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
    try {
      // Get tasks with approaching deadlines (from backend)
      const tasks = await firstValueFrom(
        this.http.get<Task[]>(`${this.apiUrl}/tasks/upcoming`)
      );
      
      console.log('Found upcoming deadline tasks:', tasks);
      
      // Show notifications for approaching deadlines
      tasks.forEach(task => {
        const deadlineDate = new Date(task.deadline);
        const now = new Date();
        const timeDiff = deadlineDate.getTime() - now.getTime();
        const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
        
        let message = '';
        if (hoursRemaining <= 1) {
          message = `Task "${task.title}" is due in less than an hour!`;
        } else if (hoursRemaining <= 24) {
          message = `Task "${task.title}" is due in ${hoursRemaining} hours.`;
        } else {
          const daysRemaining = Math.floor(hoursRemaining / 24);
          message = `Task "${task.title}" is due in ${daysRemaining} days.`;
        }
        
        // Show notification
        this.notificationService.showLocalNotification(
          'TaskTrackr Deadline Reminder', 
          message
        );
        
        // Also schedule notification for 1 hour before deadline if it's more than 1 hour away
        if (hoursRemaining > 1) {
          const oneHourBefore = new Date(deadlineDate.getTime() - (1000 * 60 * 60));
          this.scheduleDeadlineReminder(task, oneHourBefore);
        }
      });
    } catch (error) {
      console.error('Error checking upcoming deadlines:', error);
    }
  }
  
  /**
   * Schedule a reminder for a specific task at the given time
   */
  private scheduleDeadlineReminder(task: Task, reminderTime: Date): void {
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();
    
    if (delay > 0) {
      setTimeout(() => {
        this.notificationService.showLocalNotification(
          'TaskTrackr Deadline Alert',
          `Task "${task.title}" is due in 1 hour!`
        );
      }, delay);
      
      console.log(`Scheduled reminder for task "${task.title}" at ${reminderTime.toLocaleString()}`);
    }
  }
}