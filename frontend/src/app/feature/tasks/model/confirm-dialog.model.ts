import { Task } from '@feature/tasks/model/tasks.model';

export interface ConfirmDialogData {
  task: Task;
  message?: string;
}
