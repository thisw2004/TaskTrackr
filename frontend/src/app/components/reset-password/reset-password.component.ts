import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  hasToken: boolean = false;
  isSubmitting: boolean = false;
  message: string = '';
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // Initialize form based on whether we have a token
    this.token = this.route.snapshot.queryParams['token'] || '';
    this.hasToken = !!this.token;
    
    if (this.hasToken) {
      // Token exists - setup password reset form
      this.resetForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      }, { validators: this.checkPasswords });
    } else {
      // No token - setup email request form
      this.resetForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });
    }
  }

  ngOnInit() {
    // Component initialization is handled in the constructor
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    if (this.hasToken) {
      // Submit new password with token
      const newPassword = this.resetForm.get('password')?.value;
      
      this.authService.resetPassword(this.token, newPassword).subscribe(
        response => {
          this.isSubmitting = false;
          this.snackBar.open('Password has been reset successfully', 'Close', {
            duration: 5000
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open(error.error?.message || 'Error resetting password', 'Close', {
            duration: 5000
          });
        }
      );
    } else {
      // Request password reset (get token by email)
      const email = this.resetForm.get('email')?.value;
      
      this.authService.requestPasswordReset(email).subscribe(
        response => {
          this.isSubmitting = false;
          this.snackBar.open('Password reset link has been sent to your email', 'Close', {
            duration: 5000
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open(error.error?.message || 'Error requesting password reset', 'Close', {
            duration: 5000
          });
        }
      );
    }
  }
}