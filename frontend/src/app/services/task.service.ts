import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) { }

  // Check authentication and redirect if needed
  private checkAuth(): boolean {
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // Get tasks with proper authentication headers
  getTasks(): Observable<any[]> {
    if (!this.checkAuth()) {
      console.log('User not authenticated, returning empty task list');
      return of([]);
    }

    const headers = this.getAuthHeaders();
    console.log('Fetching tasks with auth token:', this.authService.getToken()?.substring(0, 10) + '...');
    
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map((response: any) => {
        // Check if the response is wrapped in a data property (common API pattern)
        if (response && response.data) {
          console.log(`Received ${response.data.length} tasks in data property`);
          return response.data;
        }
        console.log(`Received ${response.length} tasks directly`);
        return response;
      }),
      retry(1),
      catchError(this.handleError)
    );
  }
  
  // Get tasks due today
  getTasksDueToday(): Observable<any[]> {
    if (!this.checkAuth()) {
      return of([]);
    }

    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/due-today`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Get tasks by user ID
  getTasksByUserId(userId: string): Observable<any[]> {
    if (!this.checkAuth()) {
      return of([]);
    }

    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  // Get a single task
  getTask(id: string): Observable<any> {
    if (!this.checkAuth()) {
      return of(null);
    }

    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Create task (also aliased as addTask for compatibility)
  createTask(task: any): Observable<any> {
    if (!this.checkAuth()) {
      return of(null);
    }

    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, task, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Alias for createTask
  addTask(task: any): Observable<any> {
    return this.createTask(task);
  }

  // Update task (overloaded method to handle both formats)
  updateTask(idOrTask: string | any, task?: any): Observable<any> {
    if (!this.checkAuth()) {
      return of(null);
    }

    const headers = this.getAuthHeaders();
    
    // If task is undefined, then idOrTask is the task object with an id property
    if (task === undefined) {
      const taskObj = idOrTask as any;
      return this.http.put<any>(`${this.apiUrl}/${taskObj.id || taskObj._id}`, taskObj, { headers }).pipe(
        catchError(this.handleError)
      );
    } 
    // Otherwise, idOrTask is the id and task is the task object
    else {
      return this.http.put<any>(`${this.apiUrl}/${idOrTask}`, task, { headers }).pipe(
        catchError(this.handleError)
      );
    }
  }

  // Delete task
  deleteTask(id: string): Observable<any> {
    if (!this.checkAuth()) {
      return of(null);
    }

    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  // Helper method to get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No auth token available');
      this.router.navigate(['/login']);
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Error handling
  private handleError = (error: HttpErrorResponse) => {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      console.log('Authentication error, redirecting to login');
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      console.error('Forbidden access');
      // You might want to handle forbidden access differently
    } else if (error.status === 404) {
      console.error('Resource not found');
    } else if (error.status >= 500) {
      console.error('Server error');
    }
    
    // Extract the most user-friendly error message possible
    let errorMessage = 'An error occurred';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => ({
      ...error,
      friendlyMessage: errorMessage
    }));
  }
}