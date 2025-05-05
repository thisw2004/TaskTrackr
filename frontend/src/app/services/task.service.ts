import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
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
    return this.http.get<any[]>(this.apiUrl).pipe(
      retry(1),
      catchError(this.handleError)
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
  updateTask(task: any): Observable<any> {
    const id = task._id || task.id;
    
    // Format task data properly for API
    const taskData = {
      title: task.title,
      description: task.description,
      deadline: task.deadline || task.dueDate,
      priority: task.priority || 'medium',
      completed: task.completed
    };
    
    console.log('Updating task:', id, taskData);
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, taskData).pipe(
      tap(response => console.log('Update response:', response)),
      catchError(error => {
        console.error('Update error:', error);
        return this.handleError(error);
      })
    );
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