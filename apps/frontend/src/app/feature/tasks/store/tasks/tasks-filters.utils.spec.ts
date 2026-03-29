import { Task } from '@core/models';

import { applyCurrentFilters } from './tasks-filters.utils';
import { TasksFilters } from './tasks.state';

describe('applyCurrentFilters', () => {
  const baseDate = new Date(2026, 0, 4);

  const tasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      createdById: 1,
      assignedToId: 2,
      status: 'todo',
      priority: 'low',
      createdAt: baseDate,
      updatedAt: baseDate,
    },
    {
      id: 2,
      title: 'Task 2',
      createdById: 2,
      assignedToId: 1,
      status: 'in_progress',
      priority: 'medium',
      createdAt: baseDate,
      updatedAt: baseDate,
    },
    {
      id: 3,
      title: 'Task 3',
      createdById: 1,
      assignedToId: 1,
      status: 'done',
      priority: 'high',
      createdAt: baseDate,
      updatedAt: baseDate,
    },
  ];

  it('returns all tasks if no filters are provided', () => {
    const filters: TasksFilters = {};
    const result = applyCurrentFilters(tasks, filters);

    expect(result).toEqual(tasks);
  });

  it('filters by status', () => {
    const filters: TasksFilters = { status: 'todo' };
    const result = applyCurrentFilters(tasks, filters);

    expect(result).toEqual([tasks[0]]);
  });

  it('filters by priority', () => {
    const filters: TasksFilters = { priority: 'medium' };
    const result = applyCurrentFilters(tasks, filters);

    expect(result).toEqual([tasks[1]]);
  });

  it('filters by authorId', () => {
    const filters: TasksFilters = { authorId: 1 };
    const result = applyCurrentFilters(tasks, filters);

    expect(result).toEqual([tasks[0], tasks[2]]);
  });

  it('filters by assigneeId', () => {
    const filters: TasksFilters = { assigneeId: 1 };
    const result = applyCurrentFilters(tasks, filters);

    expect(result).toEqual([tasks[1], tasks[2]]);
  });

  it('filters by createdAt', () => {
    const filters: TasksFilters = { createdAt: baseDate };
    const result = applyCurrentFilters(tasks, filters);

    expect(result).toEqual(tasks);
  });

  it('combines multiple filters', () => {
    const filters: TasksFilters = { status: 'done', authorId: 1, assigneeId: 1 };
    const result = applyCurrentFilters(tasks, filters);

    expect(result).toEqual([tasks[2]]);
  });

  it('returns an empty array when no task matches', () => {
    const filters: TasksFilters = { status: 'todo', assigneeId: 1 };
    const result = applyCurrentFilters(tasks, filters);

    expect(result).toEqual([]);
  });
});
