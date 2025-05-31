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
      
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.checkTasksDueToday();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
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
          // Create a notification message with task names
          let message = `You have ${tasks.length} task(s) ending today:\n`;
          
          // Add task names (limit to first 3 to avoid too long notifications)
          const tasksToShow = tasks.slice(0, 3);
          tasksToShow.forEach((task, index) => {
            message += `• ${task.title}\n`;
          });
          
          // Add "and more..." if there are more than 3 tasks
          if (tasks.length > 3) {
            message += `• and ${tasks.length - 3} more...`;
          }
          
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