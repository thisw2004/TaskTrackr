import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  
  constructor(private authService: AuthService) {}
  
  ngAfterViewInit() {
    // Always ensure sidenav is open on initialization
    setTimeout(() => {
      if (this.sidenav && !this.sidenav.opened) {
        this.sidenav.open();
      }
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
}