import { Task, TaskStatus, TaskPriority } from "@feature/tasks/model/tasks.model";

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

export interface TaskListResponse extends ApiResponse<Task[]> {
  count: number;
  warning?: string;
}

export interface TaskDeleteResponse extends ApiResponse<null> {
  message: string;
}

export interface NewTaskRequest {
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId?: number;
}

export type TaskResponse = ApiResponse<Task>;