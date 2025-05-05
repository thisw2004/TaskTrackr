import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  dialogTitle = 'Add Task';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Create form with validation
    this.taskForm = this.fb.group({
      title: [data.title || '', Validators.required],
      description: [data.description || ''],
      dueDate: [data.dueDate || null],
      completed: [data.completed || false]
    });

    // Set dialog title based on whether we're editing or creating
    if (data.id) {
      this.dialogTitle = 'Edit Task';
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const result = {
        ...this.data,
        ...this.taskForm.value
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
