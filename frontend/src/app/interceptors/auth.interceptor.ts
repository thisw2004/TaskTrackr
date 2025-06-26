import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token directly
    const token = this.authService.getToken();
    
    // If there's a token, add it to the request header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // Log the request for debugging (you can remove this later)
    console.debug('Intercepted request:', request.url, 'with auth:', !!token);
    
    return next.handle(request).pipe(
      catchError(error => {
        console.error('HTTP error in interceptor:', error);
        
        if (error.status === 401) {
          // If the error is unauthorized and we have a token, it means the token is invalid
          if (token) {
            console.log('Token exists but unauthorized - logging out user');
            this.authService.logout();
          }
          
          this.router.navigate(['/login']);
        }
        
        // Enhance error with friendly message if possible
        let errorMessage = 'An error occurred';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 401) {
          errorMessage = 'Please log in to continue';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to access this resource';
        }
        
        const enhancedError = {
          ...error,
          friendlyMessage: errorMessage
        };
        
        return throwError(() => enhancedError);
      })
    );
  }
}