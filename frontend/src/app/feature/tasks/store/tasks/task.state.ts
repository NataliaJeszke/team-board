import { Task } from '@feature/tasks/task.model';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const initialTaskState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};
