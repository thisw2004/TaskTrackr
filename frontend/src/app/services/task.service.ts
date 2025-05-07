import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Update API URL to use environment variable or direct URL to backend
  private apiUrl = environment.apiUrl + '/tasks'; // Or use 'http://localhost:3000/api/tasks' directly

  constructor(private http: HttpClient) { }

  // Get all tasks
  getTasks(): Observable<any[]> {
    console.log('Fetching tasks from:', this.apiUrl);
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(tasks => console.log('API response:', tasks)),
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return this.handleError(error);
      })
    );
  }

  // Get task by id
  getTask(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Add new task
  addTask(task: any): Observable<any> {
    // Ensure task object has the required structure
    const taskData = {
      title: task.title,
      description: task.description,
      deadline: task.deadline || task.dueDate,
      priority: task.priority || 'medium'
    };
    
    return this.http.post<any>(this.apiUrl, taskData).pipe(
      catchError(this.handleError)
    );
  }

  // Alias for addTask to maintain compatibility
  createTask(task: any): Observable<any> {
    return this.addTask(task);
  }

  // Update task
  updateTask(taskId: string, taskData?: any): Observable<Task> {
    if (taskData) {
      return this.http.put<Task>(`${this.apiUrl}/${taskId}`, taskData);
    } else {
      return this.http.put<Task>(`${this.apiUrl}/${taskId}`, {});
    }
  }

  // Delete task
  deleteTask(id: string): Observable<any> {
    console.log('Service deleting task:', id);
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Delete successful')),
      catchError(error => {
        console.error('Delete error:', error);
        return this.handleError(error);
      })
    );
  }

  // Add this method to your TaskService class
  getUpcomingDeadlines(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/upcoming`);
  }

  // Search tasks
  searchTasks(term: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/search?q=${term}`);
  }

  // Toggle task completion
  toggleTaskCompletion(taskId: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/toggle`, {});
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}