import { createReducer, on } from '@ngrx/store';

import { normalizeDate, isSameDay } from '@utils/date.utils';

import { initialState, TasksFilters } from './tasks.state';
import { TasksActions } from './tasks.actions';

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

  on(TasksActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    count: state.count + 1,
    loading: false,
  })),

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

  on(TasksActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => (t.id === task.id ? task : t)),
    loading: false,
  })),

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

  on(TasksActions.changeTaskStatusSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => (t.id === task.id ? task : t)),
    loading: false,
  })),

  on(TasksActions.changeTaskStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TasksActions.setFilters, (state, { filters }) => {
    const newFilters: TasksFilters = { ...state.filters, ...filters };
  
    if (newFilters.createdAt) {
      newFilters.createdAt = normalizeDate(newFilters.createdAt);
    }
  
    const filteredTasks = state.tasks.filter(task => {
      if (newFilters.status && task.status !== newFilters.status) return false;
      if (newFilters.priority && task.priority !== newFilters.priority) return false;
      if (newFilters.authorId && task.createdById !== newFilters.authorId) return false;
      if (newFilters.assigneeId && task.assignedToId !== newFilters.assigneeId) return false;
  
      if (newFilters.createdAt && !isSameDay(task.createdAt, newFilters.createdAt)) return false;
  
      return true;
    });
  
    return { ...state, filters: newFilters, filteredTasks };
  }),

  on(TasksActions.clearFilters, state => ({
    ...state,
    filters: {},
    filteredTasks: [...state.tasks],
  }))
);
