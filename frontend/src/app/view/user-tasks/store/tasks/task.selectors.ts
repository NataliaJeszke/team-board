import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.state';

export const TASK_FEATURE_KEY = 'tasks';

export const selectTaskState =
  createFeatureSelector<TaskState>(TASK_FEATURE_KEY);

export const selectAllTasks = createSelector(
  selectTaskState,
  (state) => state.tasks
);

export const selectTasksLoading = createSelector(
  selectTaskState,
  (state) => state.loading
);

export const selectTaskError = createSelector(
  selectTaskState,
  (state) => state.error
);