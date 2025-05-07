import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  loading = false;
  error: string | null = null;
  categories = ['general', 'work', 'personal', 'shopping', 'health'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.loadTask(this.taskId);
    }
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(1000)],
      deadline: ['', Validators.required],
      priority: ['medium', Validators.required],
      category: ['general'],
      tags: this.fb.array([])
    });
  }

  loadTask(id: string): void {
    this.loading = true;
    this.taskService.getTask(id).subscribe({
      next: (response) => {
        const task = response.data;
        
        // Convert deadline to input format (yyyy-MM-ddThh:mm)
        const deadline = new Date(task.deadline);
        const formattedDeadline = deadline.toISOString().substring(0, 16);
        
        this.taskForm.patchValue({
          title: task.title,
          description: task.description || '',
          deadline: formattedDeadline,
          priority: task.priority,
          category: task.category || 'general'
        });
        
        // Add tags if they exist
        if (task.tags && task.tags.length > 0) {
          const tagsFormArray = this.taskForm.get('tags') as FormArray;
          task.tags.forEach(tag => {
            tagsFormArray.push(this.fb.control(tag));
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.error = 'Failed to load task. Please try again.';
        this.loading = false;
      }
    });
  }

  get tagsFormArray(): FormArray {
    return this.taskForm.get('tags') as FormArray;
  }

  addTag(): void {
    this.tagsFormArray.push(this.fb.control(''));
  }

  removeTag(index: number): void {
    this.tagsFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData: Task = this.taskForm.value;
    
    this.loading = true;
    
    if (this.isEditMode && this.taskId) {
      // Update existing task
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.error = 'Failed to update task. Please try again.';
          this.loading = false;
        }
      });
    } else {
      // Create new task
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.error = 'Failed to create task. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}