import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;
  
  constructor(private http: HttpClient, private taskService: TaskService) {}
  
  // Check for upcoming deadlines every minute
  startDeadlineChecks(): Observable<any> {
    // Check every minute (60000 ms)
    return interval(60000).pipe(
      switchMap(() => this.taskService.getUpcomingDeadlines())
    );
  }
  
  // Show browser notification if supported
  showNotification(title: string, body: string): void {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }
    
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  }
}