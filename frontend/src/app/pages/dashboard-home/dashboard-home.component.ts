import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { SpecialDayService } from '../../services/special-day.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  taskStats = {
    total: 0,
    completed: 0,
    active: 0
  };
  
  loading: boolean = false;
  error: string | null = null;
  greeting: string = '';
  specialDay: any = null;
  specialDayLoading = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    private specialDayService: SpecialDayService
  ) { }

  ngOnInit(): void {
    // Load dashboard data
    this.loadTaskStats();
    this.checkSpecialDay();
    this.setGreeting();
  }
  
  loadTaskStats(): void {
    this.loading = true;
    
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.taskStats.total = tasks.length;
        this.taskStats.completed = tasks.filter(task => task.completed).length;
        this.taskStats.active = tasks.filter(task => !task.completed).length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading task stats:', err);
        this.error = 'Unable to load task statistics.';
        this.loading = false;
      }
    });
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      this.greeting = 'Goedemorgen';
    } else if (hour < 18) {
      this.greeting = 'Goedemiddag';
    } else {
      this.greeting = 'Goedenavond';
    }
  }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  checkSpecialDay(): void {
    this.specialDayLoading = true;
    this.specialDayService.checkSpecialDay().subscribe(
      (result) => {
        this.specialDay = result;
        this.specialDayLoading = false;
      },
      (error) => {
        console.error('Error checking for special day', error);
        this.specialDayLoading = false;
        this.specialDay = {
          isSpecialDay: false,
          description: "Vandaag is een normale dag."
        };
      }
    );
  }
}