export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DELAYED: 'delayed',
  DONE: 'done',
} as const;

export const TASK_PRIORITY_OPTIONS = [
  {
    value: TASK_PRIORITY.LOW,
    labelKey: 'common.components.task-dialog.priority.low',
  },
  {
    value: TASK_PRIORITY.MEDIUM,
    labelKey: 'common.components.task-dialog.priority.medium',
  },
  {
    value: TASK_PRIORITY.HIGH,
    labelKey: 'common.components.task-dialog.priority.high',
  },
] as const;

export const TASK_STATUS_OPTIONS = [
  {
    value: TASK_STATUS.TODO,
    labelKey: 'common.components.task-dialog.status.todo',
  },
  {
    value: TASK_STATUS.IN_PROGRESS,
    labelKey: 'common.components.task-dialog.status.in_progress',
  },
  {
    value: TASK_STATUS.DELAYED,
    labelKey: 'common.components.task-dialog.status.delayed',
  },
  {
    value: TASK_STATUS.DONE,
    labelKey: 'common.components.task-dialog.status.done',
  },
] as const;
