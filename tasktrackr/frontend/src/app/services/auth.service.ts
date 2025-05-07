import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private tokenKey = 'tasktrackr_token';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  // Load user from stored token
  private loadStoredUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.getUserFromToken(token);
    }
  }

  // Get user info from token
  private getUserFromToken(token: string): void {
    this.setToken(token);
    this.getUserProfile().subscribe();
  }

  // Set JWT token in local storage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Register a new user
  register(user: { name: string; email: string; password: string }): Observable<{ success: boolean; token: string }> {
    return this.http.post<{ success: boolean; token: string }>(`${this.apiUrl}/register`, user).pipe(
      tap(res => {
        if (res.success) {
          this.setToken(res.token);
          this.getUserProfile().subscribe();
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Login user
  login(credentials: { email: string; password: string }): Observable<{ success: boolean; token: string }> {
    return this.http.post<{ success: boolean; token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success) {
          this.setToken(res.token);
          this.getUserProfile().subscribe();
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Get current user profile
  getUserProfile(): Observable<User> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/me`).pipe(
      map(res => {
        const user = res.data;
        this.userSubject.next(user);
        return user;
      }),
      catchError(error => {
        this.userSubject.next(null);
        return throwError(() => error);
      })
    );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Request password reset
  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/forgotpassword`, { email });
  }

  // Verify email with token
  verifyEmail(token: string): Observable<{ success: boolean; message: string }> {
    return this.http.get<{ success: boolean; message: string }>(`${this.apiUrl}/verify/${token}`);
  }
}