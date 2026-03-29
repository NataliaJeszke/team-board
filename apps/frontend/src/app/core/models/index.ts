// Re-export from shared library
export type {
  User,
  UserDictionary,
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskDto,
  UpdateTaskDto,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '@team-board/shared-models';

export { TASK_STATUSES, TASK_PRIORITIES } from '@team-board/shared-models';

// Frontend-specific models
export * from './language.model';
