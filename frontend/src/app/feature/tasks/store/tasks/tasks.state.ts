import { Task } from '@feature/tasks/model/tasks.model';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  count: number;
  warning: string | null;
}

export const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  count: 0,
  warning: null,
};
