import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { NewTaskRequest } from '@core/api/models/task/task-api.model';

import { TasksActions } from './store/tasks/tasks.actions';
import {
  selectTaskById,
  selectAllTasks,
  selectTasksCount,
  selectTasksError,
  selectTasksLoading,
  selectTasksWarning,
  selectTasksByStatus,
  selectTasksByCreator,
  selectTasksByAssignee,
} from './store/tasks/tasks.selectors';
import { Task, TaskStatus } from './model/tasks.model';


@Injectable({ providedIn: 'root' })
export class TasksFacade {
  private readonly store = inject(Store);

  readonly tasks = this.store.selectSignal(selectAllTasks);
  readonly loading = this.store.selectSignal(selectTasksLoading);
  readonly error = this.store.selectSignal(selectTasksError);
  readonly count = this.store.selectSignal(selectTasksCount);
  readonly warning = this.store.selectSignal(selectTasksWarning);

  loadTasks(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  createTask(task: NewTaskRequest): void {
    this.store.dispatch(TasksActions.createTask({ task }));
  }

  updateTask(id: number, changes: Partial<Task>): void {
    this.store.dispatch(TasksActions.updateTask({ id, changes }));
  }

  deleteTask(id: number): void {
    this.store.dispatch(TasksActions.deleteTask({ id }));
  }

  changeTaskStatus(id: number, status: TaskStatus): void {
    this.store.dispatch(TasksActions.changeTaskStatus({ id, status }));
  }

  getTaskById(id: number) {
    return this.store.select(selectTaskById(id));
  }

  getTasksByStatus(status: TaskStatus) {
    return this.store.select(selectTasksByStatus(status));
  }

  getTasksByAssignee(userId: number) {
    return this.store.select(selectTasksByAssignee(userId));
  }

  getTasksByCreator(userId: number) {
    return this.store.select(selectTasksByCreator(userId));
  }
}
