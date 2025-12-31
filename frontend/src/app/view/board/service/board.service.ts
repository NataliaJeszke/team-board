import { inject, Injectable } from '@angular/core';
import { EMPTY, filter, first, map, Observable, switchMap, withLatestFrom } from 'rxjs';

import { DialogService } from 'primeng/dynamicdialog';

import { User } from '@core/models';

import { TasksFacade } from '@feature/tasks/tasks.facade';
import { UsersFacade } from '@feature/users/users.facade';
import { TaskDialogResult, TaskFormValue, TaskOperationResult, TaskStatus } from '@feature/tasks/model/tasks.model';

import { TaskDialogComponent } from '@common/components/task-dialog/task-dialog.component';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { TaskUiEventsService } from '@common/components/task/service/task-ui-events.service';


@Injectable()
export class BoardService {
  private readonly dialogService = inject(DialogService);
  private readonly tasksFacade = inject(TasksFacade);
  private readonly usersFacade = inject(UsersFacade);
  private readonly taskUiEvents = inject(TaskUiEventsService);

  readonly usersDictionary = this.usersFacade.dictionary;

  openAddTaskDialog(
    currentUser$: Observable<User | null>
  ): Observable<TaskDialogResult | undefined> {
    return currentUser$.pipe(
      first(Boolean),
      map(user => {
        const dictionary = this.usersDictionary();
        const availableUsers = Object.values(dictionary);
        return { user, availableUsers };
      }),
      switchMap(({ user, availableUsers }) => {
        const ref = this.dialogService.open(TaskDialogComponent, {
          header: 'Dodaj nowe zadanie',
          width: '500px',
          data: {
            currentUserId: user.id,
            availableUsers,
          },
        });
        return ref?.onClose ?? EMPTY;
      })
    );
  }

  handleEditTaskEvents(
    currentUser$: Observable<User | null>
  ): Observable<TaskOperationResult> {
    return this.taskUiEvents.uiEvents$.pipe(
      filter(e => e.type === 'edit'),
      withLatestFrom(currentUser$),
      switchMap(([event, user]) => {
        if (!user) return EMPTY;

        const dictionary = this.usersDictionary();
        const availableUsers = Object.values(dictionary);

        const ref = this.dialogService.open(TaskDialogComponent, {
          header: 'Edytuj zadanie',
          width: '500px',
          data: {
            task: event.task,
            currentUserId: user.id,
            availableUsers,
          },
        });

        return ref?.onClose ?? EMPTY;
      }),
      switchMap(result => {
        if (result?.action === 'save') {
          this.tasksFacade.updateTask(result.taskId!, result.formValue);
          this.tasksFacade.loadTasks();

          return [
            {
              success: true,
              severity: 'success' as const,
              summary: 'Zapisano zmiany',
              detail: 'Zadanie zostało zaktualizowane',
              life: 3000,
            },
          ];
        }
        return EMPTY;
      })
    );
  }

  handleStatusChangeEvents(
    currentUser$: Observable<User | null>
  ): Observable<TaskOperationResult> {
    return this.taskUiEvents.uiEvents$.pipe(
      filter(e => e.type === 'statusChange'),
      withLatestFrom(currentUser$),
      switchMap(([event, user]) => {
        if (!user) return EMPTY;

        const upperStatus = event.status.toUpperCase() as TaskStatus;
        this.tasksFacade.changeTaskStatus(event.taskId, upperStatus);

        return EMPTY;
      }),
      map(() => ({
        success: true,
        severity: 'success' as const,
        summary: 'Status zmieniony',
        detail: 'Status zadania został zmieniony pomyślnie',
        life: 2000,
      }))
    );
  }

  handleDeleteTaskEvents(): Observable<TaskOperationResult> {
    return this.taskUiEvents.uiEvents$.pipe(
      filter(e => e.type === 'delete'),
      switchMap(event => {
        const taskId = event.taskId;

        return this.tasksFacade.getTaskById(taskId).pipe(
          first(),
          switchMap(task => {
            if (!task) return EMPTY;

            const ref = this.dialogService.open(ConfirmDialogComponent, {
              header: 'Potwierdzenie',
              width: '400px',
              data: { task },
            });

            return ref?.onClose ?? EMPTY;
          }),
          map(confirmed => ({ confirmed, taskId }))
        );
      }),
      filter(({ confirmed }) => confirmed),
      switchMap(({ taskId }) => {
        this.tasksFacade.deleteTask(taskId);
        this.tasksFacade.loadTasks();

        return [
          {
            success: true,
            severity: 'success' as const,
            summary: 'Usunięto',
            detail: 'Zadanie zostało usunięte',
            life: 3000,
          },
        ];
      })
    );
  }

  createTask(formValue: TaskFormValue): void {
    this.tasksFacade.createTask(formValue);
    this.tasksFacade.loadTasks();
  }

  initializeData(): void {
    this.tasksFacade.loadTasks();
    this.usersFacade.loadUsersDictionary();
  }
}