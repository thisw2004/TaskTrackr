import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../styles/auth.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.checkTasksDueToday();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          // Extract the error message from the response
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private checkTasksDueToday(): void {
    console.log('Checking for tasks due today...');
    this.taskService.getTasksDueToday().subscribe({
      next: (tasks) => {
        if (tasks && tasks.length > 0) {
          // Use singular or plural form based on the number of tasks
          const taskWord = tasks.length === 1 ? 'taak' : 'taken';
          let message = `Let op! Je hebt ${tasks.length} ${taskWord} met een deadline van vandaag!`;
          
          this.showNotification(message);
        } else {
          console.log('No tasks due today');
        }
      },
      error: (error) => {
        console.error('Error checking tasks due today:', error);
      }
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'View Tasks', {
      duration: 10000, // Extended duration for longer message
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['task-notification']
    }).onAction().subscribe(() => {
      // Navigate to tasks view when user clicks "View Tasks"
      this.router.navigate(['/tasks'], { queryParams: { filter: 'today' } });
    });
  }
}