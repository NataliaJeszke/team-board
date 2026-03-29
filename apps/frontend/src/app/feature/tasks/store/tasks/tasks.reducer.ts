import { createReducer, on } from '@ngrx/store';

import { initialState, TasksFilters } from './tasks.state';
import { TasksActions } from './tasks.actions';
import { applyCurrentFilters, normalizeTasksFilters } from './tasks-filters.utils';

export const tasksReducer = createReducer(
  initialState,

  on(TasksActions.loadTasks, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TasksActions.loadTasksSuccess, (state, { response }) => ({
    ...state,
    tasks: response.data,
    filteredTasks: [...response.data],
    count: response.count,
    loading: false,
    error: null,
  })),

  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TasksActions.createTask, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TasksActions.createTaskSuccess, (state, { task }) => {
    const newTasks = [...state.tasks, task];

    return {
      ...state,
      tasks: newTasks,
      filteredTasks: applyCurrentFilters(newTasks, state.filters),
      count: state.count + 1,
      loading: false,
    };
  }),

  on(TasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TasksActions.updateTask, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TasksActions.updateTaskSuccess, (state, { task }) => {
    const updatedTasks = state.tasks.map(t => (t.id === task.id ? task : t));

    return {
      ...state,
      tasks: updatedTasks,
      filteredTasks: applyCurrentFilters(updatedTasks, state.filters),
      loading: false,
    };
  }),

  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TasksActions.deleteTask, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    count: state.count - 1,
    loading: false,
  })),
  on(TasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TasksActions.changeTaskStatus, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TasksActions.changeTaskStatusSuccess, (state, { task }) => {
    const updatedTasks = state.tasks.map(t => (t.id === task.id ? task : t));

    return {
      ...state,
      tasks: updatedTasks,
      filteredTasks: applyCurrentFilters(updatedTasks, state.filters),
      loading: false,
    };
  }),

  on(TasksActions.changeTaskStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TasksActions.setFilters, (state, { filters }) => {
    const newFilters: TasksFilters = normalizeTasksFilters({ ...state.filters, ...filters });
    const filteredTasks = applyCurrentFilters(state.tasks, newFilters);

    return { ...state, filters: newFilters, filteredTasks };
  }),

  on(TasksActions.clearFilters, state => ({
    ...state,
    filters: {},
    filteredTasks: [...state.tasks],
  }))
);
