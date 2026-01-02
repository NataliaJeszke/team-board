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
  selectFilteredTasks,
  selectTasksByStatus,
  selectTasksByCreator,
  selectTasksByAssignee,
} from './store/tasks/tasks.selectors';
import { Task, TaskStatus } from './model/tasks.model';
import { TasksFilters } from './store/tasks/tasks.state';


@Injectable({ providedIn: 'root' })
export class TasksFacade {
  private readonly store = inject(Store);

  readonly tasks = this.store.selectSignal(selectAllTasks);
  readonly filteredTasks = this.store.selectSignal(selectFilteredTasks);
  readonly count = this.store.selectSignal(selectTasksCount);
  readonly loading = this.store.selectSignal(selectTasksLoading);
  readonly error = this.store.selectSignal(selectTasksError);
  readonly warning = this.store.selectSignal(selectTasksWarning);

  loadTasks(): void {
    console.log('TasksFacade: loadTasks called');
    this.store.dispatch(TasksActions.loadTasks());
  }

  createTask(task: NewTaskRequest): void {
    this.store.dispatch(TasksActions.createTask({ task }));
  }

  updateTask(id: number, changes: Partial<Task>): void {
    this.store.dispatch(TasksActions.updateTask({ id, changes }));
  }
  
  changeTaskStatus(id: number, status: TaskStatus): void {
    this.store.dispatch(TasksActions.changeTaskStatus({ id, status }));
  }

  deleteTask(id: number): void {
    this.store.dispatch(TasksActions.deleteTask({ id }));
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

  setFilters(filters: Partial<TasksFilters>) {
    this.store.dispatch(TasksActions.setFilters({ filters }));
  }

  clearFilters() {
    this.store.dispatch(TasksActions.clearFilters());
  }
}
