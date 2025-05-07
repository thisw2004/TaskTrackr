import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  constructor() { }

  onToggleComplete(): void {
    this.toggleComplete.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task._id);
  }

  isOverdue(): boolean {
    if (this.task.isCompleted) return false;
    return new Date(this.task.deadline) < new Date();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getPriorityClass(): string {
    return `priority-${this.task.priority}`;
  }
}