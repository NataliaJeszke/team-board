import { inject, Injectable } from '@angular/core';
import { EMPTY, filter, first, map, Observable, switchMap, withLatestFrom } from 'rxjs';

import { DialogService } from 'primeng/dynamicdialog';

import { User } from '@core/models';

import { TasksFacade } from '@feature/tasks/tasks.facade';
import { UsersFacade } from '@feature/users/users.facade';
import { TasksFilters } from '@feature/tasks/store/tasks/tasks.state';
import { TaskOperationResult, TaskStatus } from '@feature/tasks/model/tasks.model';
import { TasksFiltersService } from '@feature/tasks/filters/service/tasks-filters.service';


import { TaskDialogComponent } from '@common/components/task-dialog/task-dialog.component';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { TaskUiEventsService } from '@common/components/task/service/task-ui-events.service';
import { FilterConfig, FilterValues } from '@common/components/filters/model/filters.model';

@Injectable()
export class BoardService {
  private readonly dialogService = inject(DialogService);
  private readonly taskUiEvents = inject(TaskUiEventsService);
  private readonly filtersService = inject(TasksFiltersService);
  
  private readonly tasksFacade = inject(TasksFacade);
  private readonly usersFacade = inject(UsersFacade);

  readonly usersDictionary = this.usersFacade.dictionary;

  getFiltersConfig(): FilterConfig[] {
    const dictionary = this.usersDictionary();
    const availableUsers = Object.values(dictionary);
    return this.filtersService.buildConfig(availableUsers);
  }

  handleAddTaskDialog(
    currentUser$: Observable<User | null>
  ): Observable<TaskOperationResult> {
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
      }),
      switchMap(result => {
        if (result?.action === 'save' && result.formValue) {
          this.tasksFacade.createTask(result.formValue);
          this.tasksFacade.loadTasks();

          return [
            {
              success: true,
              severity: 'success' as const,
              summary: 'Sukces',
              detail: 'Zadanie zostało dodane pomyślnie',
              life: 3000,
            },
          ];
        }
        return EMPTY;
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

        return [
          {
            success: true,
            severity: 'success' as const,
            summary: 'Status zmieniony',
            detail: 'Status zadania został zmieniony pomyślnie',
            life: 2000,
          },
        ];
      })
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

  applyFilters(filters: FilterValues): void {
    console.log('apply sie wywolalo service board', filters);
    this.tasksFacade.setFilters(filters as Partial<TasksFilters>);
  }

  resetFilters(): void {
    this.tasksFacade.clearFilters();
  }

  initializeData(): void {
    this.tasksFacade.loadTasks();
    this.usersFacade.loadUsersDictionary();
  }
}