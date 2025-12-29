import { Task, TaskStatus, TaskPriority } from '@feature/tasks/task.model';

export interface TaskResponse {
  success: boolean;
  message?: string;
  data: Task;
}

export interface TaskListResponse {
  success: boolean;
  count: number;
  data: Task[];
  warning?: string;
}

export interface TaskDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateTaskDto {
  title: string;
  assignedToId: number;
  priority: TaskPriority;
  status: TaskStatus;
}
