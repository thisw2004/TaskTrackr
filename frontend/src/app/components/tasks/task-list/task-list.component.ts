import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error: string | null = null;
  
  // For filtering
  showCompleted = false;
  selectedPriority = '';
  selectedCategory = '';
  
  // For searching
  searchTerms = new Subject<string>();
  searchResults: Task[] = [];
  searching = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();

    // Set up search with debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.searching = true;
        return term ? this.taskService.searchTasks(term) : new Observable(observer => {
          observer.next({ success: true, count: 0, data: [] });
          observer.complete();
        });
      })
    ).subscribe({
      next: (response) => {
        const typedResponse = response as { success: boolean; count: number; data: Task[] };
        this.searchResults = typedResponse.data;
        this.searching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.searching = false;
      }
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks({
      completed: this.showCompleted,
      priority: this.selectedPriority || undefined,
      category: this.selectedCategory || undefined
    }).subscribe({
      next: (response) => {
        this.tasks = response.data;
        this.filteredTasks = [...this.tasks];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.error = 'Failed to load tasks. Please try again.';
        this.loading = false;
      }
    });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  clearSearch(): void {
    this.searchResults = [];
    this.searchTerms.next('');
  }

  toggleTaskCompletion(task: Task): void {
    this.taskService.toggleTaskCompletion(task._id!).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex(t => t._id === task._id);
        if (index !== -1) {
          this.tasks[index] = response.data;
          this.filteredTasks = [...this.tasks];
        }
      },
      error: (error) => {
        console.error('Error toggling task completion:', error);
      }
    });
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task._id !== id);
          this.filteredTasks = this.filteredTasks.filter(task => task._id !== id);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  applyFilters(): void {
    this.loadTasks();
  }

  resetFilters(): void {
    this.showCompleted = false;
    this.selectedPriority = '';
    this.selectedCategory = '';
    this.loadTasks();
  }
}