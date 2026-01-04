import { Task } from '@feature/tasks/model/tasks.model';
import { TasksFilters } from '@feature/tasks/store/tasks/tasks.state';
import { applyCurrentFilters } from './applyFilters.utils';

describe('applyCurrentFilters', () => {
  const baseDate = new Date(2026, 0, 4);

  const tasks: Task[] = [
    { id: 1, title: 'Task 1', createdById: 1, assignedToId: 2, status: 'todo', priority: 'low', createdAt: baseDate, updatedAt: baseDate },
    { id: 2, title: 'Task 2', createdById: 2, assignedToId: 1, status: 'in_progress', priority: 'medium', createdAt: baseDate, updatedAt: baseDate },
    { id: 3, title: 'Task 3', createdById: 1, assignedToId: 1, status: 'done', priority: 'high', createdAt: baseDate, updatedAt: baseDate },
  ];

  it('should return all tasks if no filters', () => {
    const filters: TasksFilters = {};
    const result = applyCurrentFilters(tasks, filters);
    expect(result).toEqual(tasks);
  });

  it('should filter by status', () => {
    const filters: TasksFilters = { status: 'todo' };
    const result = applyCurrentFilters(tasks, filters);
    expect(result).toEqual([tasks[0]]);
  });

  it('should filter by priority', () => {
    const filters: TasksFilters = { priority: 'medium' };
    const result = applyCurrentFilters(tasks, filters);
    expect(result).toEqual([tasks[1]]);
  });

  it('should filter by authorId', () => {
    const filters: TasksFilters = { authorId: 1 };
    const result = applyCurrentFilters(tasks, filters);
    expect(result).toEqual([tasks[0], tasks[2]]);
  });

  it('should filter by assigneeId', () => {
    const filters: TasksFilters = { assigneeId: 1 };
    const result = applyCurrentFilters(tasks, filters);
    expect(result).toEqual([tasks[1], tasks[2]]);
  });

  it('should filter by createdAt', () => {
    const filters: TasksFilters = { createdAt: baseDate };
    const result = applyCurrentFilters(tasks, filters);
    expect(result).toEqual(tasks);
  });

  it('should combine multiple filters', () => {
    const filters: TasksFilters = { status: 'done', authorId: 1, assigneeId: 1 };
    const result = applyCurrentFilters(tasks, filters);
    expect(result).toEqual([tasks[2]]);
  });

  it('should return empty array if no task matches', () => {
    const filters: TasksFilters = { status: 'todo', assigneeId: 1 };
    const result = applyCurrentFilters(tasks, filters);
    expect(result).toEqual([]);
  });
});