export interface Task {
  id?: string;
  _id?: string;  // Support both id and _id for MongoDB compatibility
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  isCompleted?: boolean; // Alias for completed
  status?: 'TODO' | 'DONE'; // Support status field
  dueDate?: Date | null;
  deadline?: Date | string; // Alias for dueDate
  createdAt?: Date;
  userId?: string;
  category?: string;
  tags?: string[];
}