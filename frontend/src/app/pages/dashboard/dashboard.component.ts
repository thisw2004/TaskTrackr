import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isMenuOpen = true;
  
  constructor(private authService: AuthService) {}
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout(): void {
    this.authService.logout();
  }
}