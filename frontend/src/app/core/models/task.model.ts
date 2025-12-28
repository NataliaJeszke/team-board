export type TaskStatus = 'todo' | 'in_progress' | 'delayed' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  assignedToId: number;
  assignedToName?: string;
  createdById: number;
  createdByName?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}