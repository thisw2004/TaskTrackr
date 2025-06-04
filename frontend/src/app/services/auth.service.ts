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
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          sessionStorage.setItem(this.tokenKey, response.token);
          
          if (response.user) {
            sessionStorage.setItem(this.userKey, JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
          
          this.authStatusSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
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
          sessionStorage.setItem(this.tokenKey, response.token);
          if (response.user) {
            sessionStorage.setItem(this.userKey, JSON.stringify(response.user));
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
        sessionStorage.setItem(this.userKey, JSON.stringify(user));
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
    return sessionStorage.getItem(this.tokenKey);
  }

  getUserData(): User | null {
    const userData = sessionStorage.getItem(this.userKey);
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
      const expiry = payload.exp * 1000;
      
      if (Date.now() >= expiry) {
        console.log('Token expired');
        this.logout();
      }
    } catch (e) {
      console.error('Error validating token', e);
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