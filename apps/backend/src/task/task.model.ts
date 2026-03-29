// Re-export from shared library
export type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskDto,
  UpdateTaskDto,
} from '@team-board/shared-models';

export { TASK_STATUSES, TASK_PRIORITIES } from '@team-board/shared-models';
