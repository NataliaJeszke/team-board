import { UserDictionary } from "@core/api/models/users/users-api.model";

export type TaskStatus = 'todo' | 'in_progress' | 'delayed' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

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