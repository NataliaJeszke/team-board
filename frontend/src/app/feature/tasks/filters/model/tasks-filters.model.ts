import { TaskStatus, TaskPriority } from "@feature/tasks/model/tasks.model";

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