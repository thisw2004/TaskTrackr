import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  
  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authStatus$ = this.authStatusSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserData());
  public currentUser = this.currentUserSubject.asObservable();
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenValidity();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    console.log('Attempting login with:', credentials.email);
    
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Login response:', response);
        
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          
          // Handle the user object, which might be in different formats
          let userData = null;
          if (response.user) {
            userData = response.user;
          } else if (response.data) {
            userData = response.data;
          }
          
          if (userData) {
            localStorage.setItem(this.userKey, JSON.stringify(userData));
            this.currentUserSubject.next(userData);
          }
          
          this.authStatusSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.authStatusSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  confirmAndLogout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.logout();
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          if (response.user) {
            localStorage.setItem(this.userKey, JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
          this.authStatusSubject.next(true);
        }
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    return this.http.get<User>(`${this.apiUrl}/user`).pipe(
      tap(user => {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-reset-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { 
      token, 
      newPassword 
    });
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return null;
    }
    
    // Verify token format
    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
      console.error('Invalid token format');
      this.logout();
      return null;
    }
    
    return token;
  }

  getUserData(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  private checkTokenValidity(): void {
    const token = this.getToken();
    if (!token) {
      return;
    }

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        this.logout();
        return;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const expirationDate = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationDate) {
        console.log('Token expired, logging out');
        this.logout();
      } else {
        // Token is valid, ensure auth status is true
        this.authStatusSubject.next(true);
        const userData = this.getUserData();
        if (userData) {
          this.currentUserSubject.next(userData);
        }
      }
    } catch (err) {
      console.error('Error checking token validity:', err);
      this.logout();
    }
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {
      token: this.getToken()
    }).pipe(
      tap(response => {
        if (response && response.token) {
          sessionStorage.setItem(this.tokenKey, response.token);
          this.authStatusSubject.next(true);
        }
      })
    );
  }
}