import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';

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

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTaskStats();
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
}