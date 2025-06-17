import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styles: [`
    .dialog-content {
      display: flex;
      flex-direction: column;
      padding: 0 20px;
      min-width: 400px;
    }
    
    .form-field {
      width: 100%;
      margin-bottom: 20px;  /* Increased from 15px */
    }
    
    .full-width {
      width: 100%;
    }
    
    /* Add specific styling for mat-form-field to ensure labels display properly */
    ::ng-deep .mat-form-field-infix {
      width: 100% !important;
      padding-top: 8px !important;
    }
    
    ::ng-deep .mat-form-field-label-wrapper {
      top: -1.5em;
      padding-top: 0.84375em;
    }
    
    .dialog-actions {
      padding: 8px 16px;
      margin-bottom: 8px;
    }

    .field-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .required {
      color: red;
      margin-left: 2px;
    }
  `]
})
export class TaskDialogComponent implements OnInit {
  taskForm!: FormGroup; // Add the non-null assertion operator (!)
  dialogTitle: string = 'Add Task';
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: [''],
      deadline: [null]
    });

    // Check if we're editing an existing task
    if (this.data && this.data.isEdit && this.data.task) {
      console.log('Editing task:', this.data.task);
      this.dialogTitle = 'Edit Task';
      
      // Populate the form with existing task data
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description || '',
        priority: this.data.task.priority || '',
        deadline: this.data.task.deadline ? new Date(this.data.task.deadline) : null
      });
      
      // Add the task ID to the form data (hidden)
      this.taskForm.addControl('_id', this.fb.control(this.data.task._id));
      this.taskForm.addControl('completed', this.fb.control(this.data.task.completed || false));
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
