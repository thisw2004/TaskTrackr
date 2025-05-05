import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.scss']
})
export class TaskFormDialogComponent implements OnInit {
  taskForm: FormGroup;
  dialogTitle: string;
  isEditMode: boolean;
  
  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task }
  ) {
    this.isEditMode = !!data.task;
    this.dialogTitle = this.isEditMode ? 'Edit Task' : 'Add New Task';
    
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['medium', Validators.required],
      dueDate: [null],
      completed: [false]
    });
    
    if (this.isEditMode && data.task) {
      this.taskForm.patchValue({
        title: data.task.title,
        description: data.task.description || '',
        priority: data.task.priority,
        dueDate: data.task.dueDate ? new Date(data.task.dueDate) : null,
        completed: data.task.completed || false
      });
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      
      // Create the task object with only the properties expected by the backend
      const task: Task = {
        // Include ID only when editing an existing task
        ...(this.isEditMode && this.data.task?.id ? { id: this.data.task.id } : {}),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: taskData.completed,
        // Include createdAt and userId only when they exist on the original task
        ...(this.isEditMode && this.data.task?.createdAt ? { createdAt: this.data.task.createdAt } : {}),
        ...(this.isEditMode && this.data.task?.userId ? { userId: this.data.task.userId } : {})
      };
      
      this.dialogRef.close(task);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}