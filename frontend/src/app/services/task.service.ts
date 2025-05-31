import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Get all tasks
  getTasks(): Observable<any[]> {
    console.log('Fetching tasks from:', this.apiUrl + '/tasks');
    return this.http.get<any[]>(this.apiUrl + '/tasks').pipe(
      map(tasks => tasks.map(task => this.normalizeTaskData(task))),
      tap(tasks => console.log('API response:', tasks)),
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get all tasks for a specific user
   * @param userId The ID of the user
   * @returns Observable of tasks array
   */
  getTasksByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/tasks`).pipe(
      map(tasks => tasks.map(task => this.normalizeTaskData(task)))
    );
  }

  // Get tasks due today
  getTasksDueToday(): Observable<any[]> {
    console.log('Fetching tasks due today...');
    
    // Use the standard tasks endpoint
    return this.http.get<any[]>(`${this.apiUrl}/tasks`).pipe(
      map(tasks => {
        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // End of today
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        
        console.log(`Filtering tasks due today (${today.toISOString()} to ${endOfDay.toISOString()})`);
        
        // Filter tasks for those due today
        return tasks.filter(task => {
          if (!task.deadline) return false;
          
          const taskDueDate = new Date(task.deadline);
          return taskDueDate >= today && taskDueDate <= endOfDay;
        });
      }),
      map(tasks => tasks.map(task => this.normalizeTaskData(task))),
      tap(tasks => {
        console.log('========================');
        console.log('Tasks due today:', tasks.length);
        tasks.forEach(task => {
          console.log(`- ${task.title} (Due: ${task.deadline})`);
        });
        console.log('========================');
      }),
      catchError(error => {
        console.error('Error fetching tasks due today:', error);
        return throwError(() => new Error('Failed to fetch tasks due today'));
      })
    );
  }

  // Get task by id
  getTask(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tasks/${id}`).pipe(
      map(task => this.normalizeTaskData(task)),
      catchError(this.handleError)
    );
  }

  // Add new task
  addTask(task: any): Observable<any> {
    // First check if deadline is valid
    const deadlineValue = task.deadline || task.dueDate;
    const hasValidDeadline = deadlineValue && 
                            deadlineValue !== '' && 
                            !isNaN(new Date(deadlineValue).getTime());
    
    const taskData = {
      title: task.title,
      description: task.description,
      deadline: hasValidDeadline ? deadlineValue : null,
      priority: task.priority || null
    };
    
    return this.http.post<any>(this.apiUrl + '/tasks', taskData).pipe(
      map(task => this.normalizeTaskData(task)),
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
    
    // First check if deadline is valid
    const deadlineValue = task.deadline || task.dueDate;
    const hasValidDeadline = deadlineValue && 
                            deadlineValue !== '' && 
                            !isNaN(new Date(deadlineValue).getTime());
    
    const taskData = {
      title: task.title,
      description: task.description,
      deadline: hasValidDeadline ? deadlineValue : null,
      priority: task.priority || null,
      completed: task.completed
    };
    
    console.log('Updating task:', id, taskData);
    
    return this.http.put<any>(`${this.apiUrl}/tasks/${id}`, taskData).pipe(
      map(task => this.normalizeTaskData(task)),
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
    return this.http.delete<any>(`${this.apiUrl}/tasks/${id}`).pipe(
      tap(() => console.log('Delete successful')),
      catchError(error => {
        console.error('Delete error:', error);
        return this.handleError(error);
      })
    );
  }

  // Save task
  saveTask(task: any): Observable<any> {
    // First check if deadline is valid
    const deadlineValue = task.deadline || task.dueDate;
    const hasValidDeadline = deadlineValue && 
                            deadlineValue !== '' && 
                            !isNaN(new Date(deadlineValue).getTime());
    
    const taskToSave = {
      title: task.title,
      description: task.description,
      priority: task.priority || null,
      deadline: hasValidDeadline ? deadlineValue : null
    };

    return this.http.post<any>(`${this.apiUrl}/tasks`, taskToSave);
  }

  // Normalize task data for consistent frontend representation
  private normalizeTaskData(task: any): any {
    // Check if deadline is empty string, null, undefined, or invalid date
    const hasValidDeadline = task.deadline && 
                            task.deadline !== '' && 
                            !isNaN(new Date(task.deadline).getTime());
    
    return {
      ...task,
      id: task._id || task.id,
      deadline: hasValidDeadline ? task.deadline : null,
      dueDate: hasValidDeadline ? task.deadline : null,
      // Set display values for UI
      deadlineDisplay: hasValidDeadline ? new Date(task.deadline).toLocaleDateString() : '-',
      createdAtDisplay: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'
    };
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}