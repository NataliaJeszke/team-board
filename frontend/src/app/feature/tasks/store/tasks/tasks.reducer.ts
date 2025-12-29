import { createReducer, on } from '@ngrx/store';

import { initialState } from './tasks.state';
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
  }))

  // Change Status
  // on(TasksActions.changeTaskStatus, (state) => ({
  //   ...state,
  //   loading: true,
  //   error: null,
  // })),
  // on(TasksActions.changeTaskStatusSuccess, (state, { task }) => ({
  //   ...state,
  //   tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  //   loading: false,
  // })),
  // on(TasksActions.changeTaskStatusFailure, (state, { error }) => ({
  //   ...state,
  //   error,
  //   loading: false,
  // }))
);
