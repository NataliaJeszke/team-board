import { Task, TaskStatus, TaskPriority } from '@feature/tasks/model/tasks.model';

export interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TasksFilters;
  count: number;
  loading: boolean;
  warning: string | null;
  error: string | null;
}

export interface TasksFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  authorId?: number;
  assigneeId?: number;
  createdAt?: Date;
}

export const initialState: TasksState = {
  tasks: [],
  filteredTasks: [],
  filters: {},
  count: 0,
  loading: false,
  warning: null,
  error: null,
};
