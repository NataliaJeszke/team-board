export const TASK_STATUSES = ['todo', 'in_progress', 'delayed', 'done'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: number;
  title: string;
  createdById: number;
  createdByName?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedToId?: number;
  assignedToName?: string;
}

export interface CreateTaskDto {
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId?: number;
}

export interface UpdateTaskDto {
  title?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedToId?: number;
}
