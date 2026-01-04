import { FilterType } from '@common/components/filters/constants/filters.constants';
import { FilterConfig, FilterOption } from '@common/components/filters/model/filters.model';

import { TASK_PRIORITIES, TASK_STATUSES } from '@feature/tasks/constants/tasks.constants';

export const TASK_STATUS_OPTIONS: readonly FilterOption[] = TASK_STATUSES.map(status => ({
  label: `features.tasks.filters.status.${status}`,
  value: status,
}));

export const TASK_PRIORITY_OPTIONS: readonly FilterOption[] = TASK_PRIORITIES.map(priority => ({
  label: `features.tasks.filters.priority.${priority}`,
  value: priority,
}));

export const TASK_KEYS = {
  STATUS: 'status',
  PRIORITY: 'priority',
  AUTHOR_ID: 'authorId',
  ASSIGNEE_ID: 'assigneeId',
  CREATED_AT: 'createdAt',
} as const;

export const TASK_FILTERS_CONFIG: readonly FilterConfig[] = [
    {
      key: TASK_KEYS.STATUS,
      type: FilterType.SELECT,
      placeholder: 'features.tasks.filters.labels.status',
      options: TASK_STATUS_OPTIONS,
      width: '10rem',
    },
    {
      key: TASK_KEYS.PRIORITY,
      type: FilterType.SELECT,
      placeholder: 'features.tasks.filters.labels.priority',
      options: TASK_PRIORITY_OPTIONS,
      width: '10rem',
    },
    {
      key: TASK_KEYS.AUTHOR_ID,
      type: FilterType.SELECT,
      placeholder: 'features.tasks.filters.labels.author',
      options: [],
      width: '18rem',
    },
    {
      key: TASK_KEYS.ASSIGNEE_ID,
      type: FilterType.SELECT,
      placeholder: 'features.tasks.filters.labels.assignee',
      options: [],
      width: '18rem',
    },
    {
      key: TASK_KEYS.CREATED_AT,
      type: FilterType.DATE,
      placeholder: 'features.tasks.filters.labels.createdAt',
      width: '300px',
    },
  ] as const satisfies readonly FilterConfig[];
