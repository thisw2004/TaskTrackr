import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../styles/auth.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  hidePassword = true;
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.errorMessage = '';

    this.authService.register({
      email: this.registerForm.get('email')?.value as string,
      password: this.registerForm.get('password')?.value as string,
      name: this.registerForm.get('firstName')?.value as string
    }).subscribe({
      next: (): void => {
        
        // Navigate to login with success message
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error: (error: any): void => {
        console.error('Registration error:', error);
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.friendlyMessage) {
          this.errorMessage = error.friendlyMessage;
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid registration details. Please check your information and try again.';
        } else if (error.status === 409 || (error.error && error.error.includes('duplicate'))) {
          this.errorMessage = 'This email address is already registered. Please use a different email.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
  }
