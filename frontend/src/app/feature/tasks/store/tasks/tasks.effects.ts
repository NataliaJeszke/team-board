import { inject, Injectable } from '@angular/core';
import { catchError, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { TaskApiService } from '@core/api/services/task-api/task-api.service';

import { TasksActions } from './tasks.actions';

@Injectable()
export class TasksEffects {
  private readonly actions$ = inject(Actions);
  private readonly taskApiService = inject(TaskApiService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      mergeMap(() =>
        this.taskApiService.getTasks().pipe(
          map(response => TasksActions.loadTasksSuccess({ response })),
          catchError(error => of(TasksActions.loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  // createTask$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(TasksActions.createTask),
  //     mergeMap(({ task }) =>
  //       this.taskApiService.createTask(task).pipe(
  //         map((task) => TasksActions.createTaskSuccess({ task })),
  //         catchError((error) =>
  //           of(TasksActions.createTaskFailure({ error: error.message }))
  //         )
  //       )
  //     )
  //   )
  // );

  // updateTask$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(TasksActions.updateTask),
  //     mergeMap(({ id, changes }) =>
  //       this.taskApiService.updateTask(id, changes).pipe(
  //         map(task => TasksActions.updateTaskSuccess({ task })),
  //         catchError(error => of(TasksActions.updateTaskFailure({ error: error.message })))
  //       )
  //     )
  //   )
  // );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap(({ id }) =>
        this.taskApiService.deleteTask(id).pipe(
          map(() => TasksActions.deleteTaskSuccess({ id })),
          catchError(error => of(TasksActions.deleteTaskFailure({ error: error.message })))
        )
      )
    )
  );

  // changeTaskStatus$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(TasksActions.changeTaskStatus),
  //     mergeMap(({ id, status }) =>
  //       this.taskApiService.updateTaskStatus(id, status).pipe(
  //         map((task) => TasksActions.changeTaskStatusSuccess({ task })),
  //         catchError((error) =>
  //           of(TasksActions.changeTaskStatusFailure({ error: error.message }))
  //         )
  //       )
  //     )
  //   )
  // );
}
