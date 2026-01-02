import { inject, Injectable } from '@angular/core';
import { EMPTY, filter, first, map, Observable, switchMap } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';

import { User } from '@core/models';

import { TasksFacade } from '@feature/tasks/tasks.facade';
import { UsersDictionaryFacade } from '@feature/users-dictionary/users-dictionary.facade';
import { TasksFilters } from '@feature/tasks/store/tasks/tasks.state';
import { TaskOperationResult } from '@feature/tasks/model/tasks.model';
import { TasksFiltersService } from '@feature/tasks/filters/service/tasks-filters.service';

import { TaskDialogComponent } from '@common/components/task-dialog/task-dialog.component';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { TaskUiEventsService } from '@common/components/task/service/task-ui-events.service';
import { FilterConfig, FilterValues } from '@common/components/filters/model/filters.model';

@Injectable()
export class BoardService {
  private readonly translate = inject(TranslateService);
  private readonly dialogService = inject(DialogService);
  private readonly taskUiEvents = inject(TaskUiEventsService);
  private readonly filtersService = inject(TasksFiltersService);

  private readonly tasksFacade = inject(TasksFacade);
  private readonly usersDictionaryFacade = inject(UsersDictionaryFacade);

  readonly usersDictionary = this.usersDictionaryFacade.dictionary;

  getFiltersConfig(): FilterConfig[] {
    const dictionary = this.usersDictionary();
    const availableUsers = Object.values(dictionary);
    return this.filtersService.buildConfig(availableUsers);
  }

  handleAddTaskDialog(currentUser: User | null): Observable<TaskOperationResult> {
    if (!currentUser) return EMPTY;

    const dictionary = this.usersDictionary();
    const availableUsers = Object.values(dictionary);

    const ref = this.dialogService.open(TaskDialogComponent, {
      header: this.translate.instant('common.components.task-dialog.titleCreate'),
      width: '500px',
      data: {
        currentUserId: currentUser.id,
        availableUsers,
      },
    });

    return (ref?.onClose ?? EMPTY).pipe(
      switchMap(result => {
        if (result?.action === 'save' && result.formValue) {
          this.tasksFacade.createTask(result.formValue);

          return [
            {
              success: true,
              severity: 'success' as const,
              summary: this.translate.instant('views.board.toast.taskCreated.summary'),
              detail: this.translate.instant('views.board.toast.taskCreated.detail'),
              life: 3000,
            },
          ];
        }
        return EMPTY;
      })
    );
  }

  handleEditTaskEvents(currentUser: User | null): Observable<TaskOperationResult> {
    return this.taskUiEvents.uiEvents$.pipe(
      filter(e => e.type === 'edit'),
      switchMap(event => {
        if (!currentUser) return EMPTY;

        const dictionary = this.usersDictionary();
        const availableUsers = Object.values(dictionary);

        const ref = this.dialogService.open(TaskDialogComponent, {
          header: this.translate.instant('common.components.task-dialog.titleEdit'),
          width: '500px',
          data: {
            task: event.task,
            currentUserId: currentUser.id,
            availableUsers,
          },
        });

        return (ref?.onClose ?? EMPTY).pipe(
          switchMap(result => {
            if (result?.action === 'save') {
              this.tasksFacade.updateTask(result.taskId!, result.formValue);

              return [
                {
                  success: true,
                  severity: 'success' as const,
                  summary: this.translate.instant('views.board.toast.taskUpdated.summary'),
                  detail: this.translate.instant('views.board.toast.taskUpdated.detail'),
                  life: 3000,
                },
              ];
            }
            return EMPTY;
          })
        );
      })
    );
  }

  handleStatusChangeEvents(currentUser: User | null): Observable<TaskOperationResult> {
    return this.taskUiEvents.uiEvents$.pipe(
      filter(e => e.type === 'statusChange'),
      switchMap(event => {
        if (!currentUser) return EMPTY;

        this.tasksFacade.changeTaskStatus(event.taskId, event.status);

        return [
          {
            success: true,
            severity: 'success' as const,
            summary: this.translate.instant('views.board.toast.taskStatusChanged.summary'),
            detail: this.translate.instant('views.board.toast.taskStatusChanged.detail'),
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

        return [
          {
            success: true,
            severity: 'success' as const,
            summary: this.translate.instant('views.board.toast.taskDeleted.summary'),
            detail: this.translate.instant('views.board.toast.taskDeleted.detail'),
            life: 3000,
          },
        ];
      })
    );
  }

  applyFilters(filters: FilterValues): void {
    this.tasksFacade.setFilters(filters as Partial<TasksFilters>);
  }

  resetFilters(): void {
    this.tasksFacade.clearFilters();
  }

  initializeData(): void {
    this.tasksFacade.loadTasks();
    this.usersDictionaryFacade.loadUsersDictionary();
  }
}
