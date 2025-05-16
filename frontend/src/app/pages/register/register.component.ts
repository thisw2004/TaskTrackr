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

    this.authService.register(
      this.registerForm.get('firstName')?.value as string,
      this.registerForm.get('email')?.value as string,
      this.registerForm.get('password')?.value as string
    ).subscribe({
      next: (): void => {
        
        // Navigate to login with success message
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error: (error: { error: { message: string } }): void => {
      
        this.errorMessage = error.error.message || 'Registration failed. Please try again.';
      }
    });
  }
  }
