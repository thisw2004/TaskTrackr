import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// User model interface
export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { name, email, password });
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(response => {
          // Store user details and token in local storage
          const user = response.user as User;
          user.token = response.token;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserValue;
    return !!currentUser && !!currentUser.token;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser;
  }

  updateUserProfile(updatedProfile: User, profileImage?: File | null): Observable<User> {
    console.log('Updating profile:', updatedProfile);

    this.currentUserSubject.next(updatedProfile);
    localStorage.setItem('currentUser', JSON.stringify(updatedProfile));

    return of(updatedProfile);
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    // Implement logic to check authentication status
    // For example, check if a valid token exists in localStorage
    const token = localStorage.getItem('authToken');
    return !!token; // Return true if token exists, otherwise false
  }

  requestPasswordReset(email: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/request-reset`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, { 
      token, 
      newPassword 
    });
  }

  private getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}