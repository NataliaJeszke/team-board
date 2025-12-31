import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Task, TaskStatus } from '@feature/tasks/model/tasks.model';
import { TasksState } from './tasks.state';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(selectTasksState, state => state.tasks);

export const selectTasksLoading = createSelector(selectTasksState, state => state.loading);

export const selectTasksError = createSelector(selectTasksState, state => state.error);

export const selectTasksCount = createSelector(selectTasksState, state => state.count);

export const selectTasksWarning = createSelector(selectTasksState, state => state.warning);

export const selectTaskById = (id: number) =>
  createSelector(selectAllTasks, (tasks: Task[]) => tasks.find(task => task.id === id));

export const selectTasksByStatus = (status: TaskStatus) =>
  createSelector(selectAllTasks, tasks => tasks.filter((task: Task) => task.status === status));

export const selectTasksByAssignee = (userId: number) =>
  createSelector(selectAllTasks, tasks =>
    tasks.filter((task: Task) => task.assignedToId === userId)
  );

export const selectTasksByCreator = (userId: number) =>
  createSelector(selectAllTasks, tasks =>
    tasks.filter((task: Task) => task.createdById === userId)
  );
