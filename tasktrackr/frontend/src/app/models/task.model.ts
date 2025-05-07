export interface Task {
  _id?: string;
  user?: string;
  title: string;
  description?: string;
  deadline: Date;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  reminderSent?: boolean;
  createdAt?: Date;
  completedAt?: Date;
}