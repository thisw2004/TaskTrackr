import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent implements OnInit, AfterViewInit {
  @ViewChild(TaskListComponent) taskList!: TaskListComponent;
  viewInitialized = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
  }

  onAddTaskClick(): void {
    if (this.viewInitialized && this.taskList) {
      this.taskList.addTask();
    } else {
      console.error('TaskListComponent not yet initialized');
      // As a fallback, try again after a short delay
      setTimeout(() => {
        if (this.taskList) {
          this.taskList.addTask();
        } else {
          console.error('TaskListComponent still not available');
        }
      }, 100);
    }
  }
  
  addNewTask(): void {
    this.onAddTaskClick();
  }
}
