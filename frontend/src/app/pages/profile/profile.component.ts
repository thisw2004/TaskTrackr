import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any;
  isEditing = false;
  selectedFile: File | null = null;
  profileImageUrl: string | null = null;
  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Initialize form with empty values
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{value: '', disabled: true}],
      bio: [''],
      phone: ['']
    });
  }
  
  ngOnInit(): void {
    // In a real app, get user data from a service
    // For now, we'll use mock data
    this.user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Software Developer',
      phone: '555-1234'
    };
    
    this.profileForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      bio: this.user.bio || '',
      phone: this.user.phone || ''
    });
    
    this.profileImageUrl = 'assets/default-avatar.png';
  }
  
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue({
        name: this.user.name,
        bio: this.user.bio || '',
        phone: this.user.phone || ''
      });
    }
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Display preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedProfile = {
        ...this.user,
        name: this.profileForm.value.name,
        bio: this.profileForm.value.bio,
        phone: this.profileForm.value.phone
      };
      
      // In a real app, call the service to update profile
      console.log('Saving profile:', updatedProfile);
      this.user = updatedProfile;
      this.isEditing = false;
    }
  }
}