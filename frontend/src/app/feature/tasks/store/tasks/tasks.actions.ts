import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CreateTaskDto, TaskListResponse } from '@core/api/models/task/task-api.model';

import { Task, TaskStatus } from '@feature/tasks/tasks.model';

export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ response: TaskListResponse }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    'Create Task': props<{ task: CreateTaskDto }>(),
    'Create Task Success': props<{ task: Task }>(),
    'Create Task Failure': props<{ error: string }>(),

    'Update Task': props<{ id: number; changes: Partial<Task> }>(),
    'Update Task Success': props<{ task: Task }>(),
    'Update Task Failure': props<{ error: string }>(),

    'Delete Task': props<{ id: number }>(),
    'Delete Task Success': props<{ id: number }>(),
    'Delete Task Failure': props<{ error: string }>(),

    'Change Task Status': props<{ id: number; status: TaskStatus }>(),
    'Change Task Status Success': props<{ task: Task }>(),
    'Change Task Status Failure': props<{ error: string }>(),
  },
});
