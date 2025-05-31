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
      title: ['', Validators.required],
      description: [''],
      priority: [''], // Optional
      deadline: ['']  // Optional, renamed from dueDate
    });

    // Set dialog title based on whether we're editing or creating
    if (data.id) {
      this.dialogTitle = 'Edit Task';
      this.taskForm.patchValue({
        title: data.title,
        description: data.description,
        priority: data.priority || '',
        deadline: data.deadline ? this.formatDateForInput(data.deadline) : ''
      });
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

  private formatDateForInput(date: string): string {
    // Implement date formatting logic here
    return date;
  }
}
