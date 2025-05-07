import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  user$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private loadUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  register(userData: { name: string, email: string, password: string } | string, email?: string, password?: string): Observable<any> {
    // Support both object and individual params
    if (typeof userData === 'string' && email && password) {
      return this.http.post(`${this.apiUrl}/register`, { name: userData, email, password });
    } else {
      return this.http.post(`${this.apiUrl}/register`, userData);
    }
  }

  login(credentials: { email: string, password: string } | string, password?: string): Observable<User> {
    // Support both object and individual params
    if (typeof credentials === 'string' && password) {
      return this.http.post<User>(`${this.apiUrl}/login`, { email: credentials, password });
    } else {
      return this.http.post<User>(`${this.apiUrl}/login`, credentials);
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  logout(): void {
    // Clear the stored user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Update the user subject
    this.currentUserSubject.next(null);
    
    // Optional: Navigate to login page
    // If you want to handle navigation, inject Router in the constructor
    // this.router.navigate(['/login']);
  }
}