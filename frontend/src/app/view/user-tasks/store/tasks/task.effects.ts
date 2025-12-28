import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { TaskActions } from './task.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { TaskApiService } from '@core/api/services/task-api/task-api.service';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private api = inject(TaskApiService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.api.getTasks().pipe(
          map((res) =>
            TaskActions.loadTasksSuccess({ tasks: res.data })
          ),
          catchError((err) =>
            of(TaskActions.loadTasksFailure({ error: err.message }))
          )
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      mergeMap(({ task }) =>
        this.api.createTask(task).pipe(
          map((res) =>
            TaskActions.createTaskSuccess({ task: res.data })
          ),
          catchError((err) =>
            of(TaskActions.createTaskFailure({ error: err.message }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ id, task }) =>
        this.api.updateTask(id, task).pipe(
          map((res) =>
            TaskActions.updateTaskSuccess({ task: res.data })
          ),
          catchError((err) =>
            of(TaskActions.updateTaskFailure({ error: err.message }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.api.deleteTask(id).pipe(
          map(() =>
            TaskActions.deleteTaskSuccess({ id })
          ),
          catchError((err) =>
            of(TaskActions.deleteTaskFailure({ error: err.message }))
          )
        )
      )
    )
  );
}