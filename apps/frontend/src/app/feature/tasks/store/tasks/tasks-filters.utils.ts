import { Task } from '@core/models';
import { normalizeDate, isSameDay } from '@utils/date/date.utils';

import { TasksFilters } from './tasks.state';

export function normalizeTasksFilters(filters: TasksFilters): TasksFilters {
  const normalizedFilters = { ...filters };

  if (normalizedFilters.createdAt) {
    normalizedFilters.createdAt = normalizeDate(normalizedFilters.createdAt);
  }

  return normalizedFilters;
}

export function applyCurrentFilters(tasks: Task[], filters: TasksFilters): Task[] {
  const normalizedFilters = normalizeTasksFilters(filters);

  if (Object.keys(normalizedFilters).length === 0) {
    return [...tasks];
  }

  return tasks.filter(task => {
    if (normalizedFilters.status && task.status !== normalizedFilters.status) return false;
    if (normalizedFilters.priority && task.priority !== normalizedFilters.priority) return false;
    if (normalizedFilters.authorId && task.createdById !== normalizedFilters.authorId) return false;
    if (normalizedFilters.assigneeId && task.assignedToId !== normalizedFilters.assigneeId)
      return false;

    if (normalizedFilters.createdAt && !isSameDay(task.createdAt, normalizedFilters.createdAt)) {
      return false;
    }

    return true;
  });
}
