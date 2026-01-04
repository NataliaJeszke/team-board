import { Task } from '@feature/tasks/model/tasks.model';
import { TasksFilters } from '@feature/tasks/store/tasks/tasks.state';

import { normalizeDate, isSameDay } from '../date/date.utils';

export function applyCurrentFilters(tasks: Task[], filters: TasksFilters): Task[] {
  if (Object.keys(filters).length === 0) {
    return [...tasks];
  }

  const normalizedFilters = { ...filters };
  if (normalizedFilters.createdAt) {
    normalizedFilters.createdAt = normalizeDate(normalizedFilters.createdAt);
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
