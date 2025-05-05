export interface Task {
  id?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: Date | null;
  createdAt?: Date;
  userId?: string;
  // We'll handle updatedAt separately since it might not be expected by the backend
}