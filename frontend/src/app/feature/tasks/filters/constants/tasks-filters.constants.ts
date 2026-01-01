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

export const TASK_FILTERS_CONFIG: readonly FilterConfig[] = [
    {
      key: 'status',
      type: 'select',
      placeholder: 'features.tasks.filters.labels.status',
      options: TASK_STATUS_OPTIONS,
      width: '10rem',
    },
    {
      key: 'priority',
      type: 'select',
      placeholder: 'features.tasks.filters.labels.priority',
      options: TASK_PRIORITY_OPTIONS,
      width: '10rem',
    },
    {
      key: 'authorId',
      type: 'select',
      placeholder: 'features.tasks.filters.labels.author',
      options: [],
      width: '18rem',
    },
    {
      key: 'assigneeId',
      type: 'select',
      placeholder: 'features.tasks.filters.labels.assignee',
      options: [],
      width: '18rem',
    },
    {
      key: 'createdAt',
      type: 'date',
      placeholder: 'features.tasks.filters.labels.createdAt',
      width: '300px',
    },
  ];
