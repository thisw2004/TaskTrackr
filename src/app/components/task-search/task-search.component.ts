import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.css']
})
export class TaskSearchComponent {
  searchTerm: string = '';
  @Output() search = new EventEmitter<string>();
  
  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.search.emit(value);
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.search.emit('');
  }
}
