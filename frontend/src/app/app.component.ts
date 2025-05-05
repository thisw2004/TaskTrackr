import { Component } from '@angular/core';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TaskTrackr';
  tasks: Task[] = [
    {
      id: '1',
      title: 'Complete Angular project',
      description: 'Finish TaskTrackr application implementation',
      deadline: '2025-05-10',
      completed: false
    },
    {
      id: '2',
      title: 'Study for exam',
      description: 'Review chapters 5-8 for Advanced Programming exam',
      deadline: '2025-05-15',
      completed: false
    },
    {
      id: '3',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, and vegetables',
      deadline: '2025-05-06',
      completed: true
    }
  ];

  newTask: Partial<Task> = {
    title: '',
    description: '',
    deadline: ''
  };

  editingTask: Task | null = null;
  minDate: string = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  getActiveTasks(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter(task => task.completed);
  }

  validateDate(dateStr: string): boolean {
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    return selectedDate >= today;
  }

  addTask(): void {
    if (!this.newTask.title || !this.newTask.deadline) return;
    
    // Validate date is not in the past
    if (!this.validateDate(this.newTask.deadline)) {
      alert('Deadline cannot be in the past. Please select a future date.');
      return;
    }
    
    const task: Task = {
      id: Date.now().toString(),
      title: this.newTask.title,
      description: this.newTask.description || '',
      deadline: this.newTask.deadline,
      completed: false
    };

    this.tasks.unshift(task);
    
    // Reset form
    this.newTask = {
      title: '',
      description: '',
      deadline: ''
    };
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    }
  }

  editTask(task: Task): void {
    // Create a copy of the task to avoid direct mutation
    this.editingTask = { ...task };
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  saveEditedTask(): void {
    if (!this.editingTask || !this.editingTask.title || !this.editingTask.deadline) return;
    
    // Validate date is not in the past
    if (!this.validateDate(this.editingTask.deadline)) {
      alert('Deadline cannot be in the past. Please select a future date.');
      return;
    }
    
    // Find and update the task in the array
    this.tasks = this.tasks.map(task => 
      task.id === this.editingTask!.id ? this.editingTask! : task
    );
    
    // Exit edit mode
    this.editingTask = null;
  }

  toggleComplete(task: Task): void {
    const taskElement = document.getElementById(`task-${task.id}`);
    if (taskElement && !task.completed) {
      taskElement.classList.add('task-completed-animation');
      
      setTimeout(() => {
        task.completed = !task.completed;
      }, 500);
    } else {
      task.completed = !task.completed;
    }
  }

  isOverdue(task: Task): boolean {
    if (task.completed) return false;
    return new Date(task.deadline) < new Date();
  }
}
