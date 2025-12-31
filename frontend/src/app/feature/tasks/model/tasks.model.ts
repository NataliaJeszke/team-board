import { UserDictionary } from "@core/api/models/users/users-api.model";

import { TASK_STATUSES, TASK_PRIORITIES } from "../constants/tasks.constants";

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
  life: number;
}

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];