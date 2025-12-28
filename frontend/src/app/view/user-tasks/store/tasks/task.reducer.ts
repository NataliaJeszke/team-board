import { createReducer, on } from '@ngrx/store';
import { TaskActions } from './task.actions';
import { initialTaskState } from './task.state';

export const taskReducer = createReducer(
  initialTaskState,

  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),

  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TaskActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
  })),

  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
  })),

  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
  }))
);