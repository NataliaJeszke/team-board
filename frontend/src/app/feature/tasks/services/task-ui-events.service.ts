import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Task, TaskStatus } from '@feature/tasks/model/tasks.model';

export type TaskUiEvent =
  | { type: 'edit'; task: Task }
  | { type: 'delete'; taskId: number }
  | { type: 'statusChange'; taskId: number; status: TaskStatus };

@Injectable({ providedIn: 'root' })
export class TaskUiEventsService {
  private readonly events$ = new Subject<TaskUiEvent>();

  readonly uiEvents$ = this.events$.asObservable();

  edit(task: Task): void {
    this.events$.next({ type: 'edit', task });
  }

  delete(taskId: number): void {
    this.events$.next({ type: 'delete', taskId });
  }

  changeStatus(taskId: number, status: TaskStatus): void {
    this.events$.next({ type: 'statusChange', taskId, status });
  }
}
