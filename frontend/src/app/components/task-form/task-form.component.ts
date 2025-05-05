import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="title">Title</label>
        <input type="text" id="title" formControlName="title">
      </div>
      <div>
        <label for="description">Description</label>
        <textarea id="description" formControlName="description"></textarea>
      </div>
      <div>
        <label for="dueDate">Due Date</label>
        <input type="date" id="dueDate" formControlName="dueDate">
      </div>
      <button type="submit" [disabled]="!taskForm.valid">Save Task</button>
    </form>
  `,
  styles: []
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder) { 
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['']
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      console.log(this.taskForm.value);
      // Submit to service
    }
  }
}