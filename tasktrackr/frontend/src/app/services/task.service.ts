import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  // Get all tasks with optional filtering
  getTasks(filters?: { completed?: boolean; priority?: string; category?: string }): Observable<{success: boolean, count: number, data: Task[]}> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.completed !== undefined) {
        params = params.append('completed', filters.completed.toString());
      }
      if (filters.priority) {
        params = params.append('priority', filters.priority);
      }
      if (filters.category) {
        params = params.append('category', filters.category);
      }
    }
    
    return this.http.get<{success: boolean, count: number, data: Task[]}>(this.apiUrl, { params });
  }

  // Get a single task by ID
  getTask(id: string): Observable<{success: boolean, data: Task}> {
    return this.http.get<{success: boolean, data: Task}>(`${this.apiUrl}/${id}`);
  }

  // Create a new task
  createTask(task: Task): Observable<{success: boolean, data: Task}> {
    return this.http.post<{success: boolean, data: Task}>(this.apiUrl, task);
  }

  // Update an existing task
  updateTask(id: string, task: Task): Observable<{success: boolean, data: Task}> {
    return this.http.put<{success: boolean, data: Task}>(`${this.apiUrl}/${id}`, task);
  }

  // Delete a task
  deleteTask(id: string): Observable<{success: boolean, data: {}}> {
    return this.http.delete<{success: boolean, data: {}}>(`${this.apiUrl}/${id}`);
  }

  // Mark a task as complete/incomplete
  toggleTaskCompletion(id: string): Observable<{success: boolean, data: Task}> {
    return this.http.put<{success: boolean, data: Task}>(`${this.apiUrl}/${id}/complete`, {});
  }

  // Search for tasks by keyword
  searchTasks(keyword: string): Observable<{success: boolean, count: number, data: Task[]}> {
    const params = new HttpParams().append('keyword', keyword);
    return this.http.get<{success: boolean, count: number, data: Task[]}>(`${this.apiUrl}/search`, { params });
  }

  // Get tasks with upcoming deadlines
  getUpcomingDeadlines(): Observable<{success: boolean, count: number, data: Task[]}> {
    return this.http.get<{success: boolean, count: number, data: Task[]}>(`${this.apiUrl}/deadlines`);
  }
}