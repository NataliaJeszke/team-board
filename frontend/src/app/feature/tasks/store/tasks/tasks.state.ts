import { Task } from '@feature/tasks/model/tasks.model';

export interface TasksState {
  tasks: Task[];
  count: number;
  loading: boolean;
  warning: string | null;
  error: string | null;
}

export const initialState: TasksState = {
  tasks: [],
  count: 0,
  loading: false,
  warning: null,
  error: null,
};
