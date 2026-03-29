import { UserDictionary } from "@core/api/models/users/users-api.model";
import { Task, TaskStatus, TaskPriority } from '@core/models';

// Re-export core types
export type { Task, TaskStatus, TaskPriority } from '@core/models';
export { TASK_STATUSES, TASK_PRIORITIES } from '@core/models';

export interface TaskFormValue {
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId?: number;
}

export interface TaskDialogData {
  availableUsers: UserDictionary[];
  currentUserId: number;
  task?: Task;
}

export interface TaskDialogResult {
  action: 'save' | 'cancel';
  formValue?: TaskFormValue;
  taskId?: number;
}

export interface TaskOperationResult {
  success: boolean;
  severity: 'success' | 'error' | 'warn' | 'info';
  summary: string;
  detail: string;
}