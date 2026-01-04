import { TaskStatus, TaskPriority } from "@feature/tasks/model/tasks.model";

import { TASK_KEYS } from "../constants/tasks-filters.constants";

export interface TaskFilters {
    status?: TaskStatus;
    priority?: TaskPriority;
    authorId?: string;
    assigneeId?: string;
    createdAt?: Date | null;
  }

  export interface UserForFilters {
    id: number;
    name: string;
  }

  export type TaskKey = typeof TASK_KEYS[keyof typeof TASK_KEYS];