import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';
import { TaskService } from '../../services/task.service'; // Add this import

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  showDevSettings = false;
  debugMode = false;
  apiUrl: string;
  swaggerUrl = 'http://localhost:3000/api/swagger';

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private taskService: TaskService // Add this service
  ) {
    this.apiUrl = environment.apiUrl || 'http://localhost:3000/api';
  }

  ngOnInit(): void {
    // Nothing specific needed on init
  }

  toggleDevSettings(): void {
    this.showDevSettings = !this.showDevSettings;
  }

  openSwaggerDocs(): void {
    window.open(`${this.apiUrl}/docs`, '_blank');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('URL copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  }

  testNotification(): void {
    this.snackBar.open('This is a test notification from TaskTrackr!', 'Dismiss', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['notification-success']
    });

    console.log('Test notification sent at:', new Date().toISOString());
  }

  /**
   * Check for tasks expiring today for a specific user and show notifications
   * @param userId The ID of the user to check tasks for
   */
  checkExpiringTasks(userId: string): void {
    this.taskService.getTasksByUserId(userId).subscribe({
      next: (tasks) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        
        const expiringTasks = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
        
        this.showExpiringTaskNotifications(expiringTasks, userId);
      },
      error: (err) => {
        console.error('Failed to fetch tasks:', err);
      }
    });
  }
  
  /**
   * Display notifications for tasks expiring today
   * @param tasks Array of tasks expiring today
   * @param userId ID of the user who owns the tasks
   */
  private showExpiringTaskNotifications(tasks: any[], userId: string): void {
    if (tasks.length === 0) return;
    
    tasks.forEach(task => {
      this.snackBar.open(`Task "${task.title}" is expiring today!`, 'View', {
        duration: 8000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['notification-warning']
      });
      
      console.log(`Notification sent for task ${task.id} to user ${userId} at:`, new Date().toISOString());
    });
  }
}
