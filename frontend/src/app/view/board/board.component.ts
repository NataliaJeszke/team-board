import { Component, effect, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EMPTY, filter, first, map, switchMap, withLatestFrom } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { AuthFacade } from '@core/auth/auth.facade';

import { TasksFacade } from '@feature/tasks/tasks.facade';
import { UsersFacade } from '@feature/users/users.facade';

import { HeaderComponent } from '@common/components/header/header.component';
import { TaskDialogComponent } from '@common/components/task-dialog/task-dialog.component';
import { UserTasksComponent } from '@common/components/user-tasks-list/user-tasks-list.component';
import { TaskUiEventsService } from '@feature/tasks/services/task-ui-events.service';
import { TaskStatus } from '@feature/tasks/tasks.model';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'tb-board',
  templateUrl: './board.component.html',
  imports: [AsyncPipe, ButtonModule, HeaderComponent, UserTasksComponent, ToastModule],
  providers: [DialogService, MessageService],
})
export class BoardComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly usersFacade = inject(UsersFacade);
  protected readonly tasksFacade = inject(TasksFacade);

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly taskUiEvents = inject(TaskUiEventsService);

  readonly currentUser$ = this.authFacade.user$;
  readonly usersDictionary = this.usersFacade.dictionary;

  constructor() {
    effect(() => {
      const dict = this.usersDictionary();
      console.log('📦 Users dictionary w BoardComponent:', dict);
    });

    effect(() => {
      const error = this.tasksFacade.error$();
      if (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: error,
          life: 5000,
        });
      }
    });

    effect(() => {
      const warning = this.tasksFacade.warning$();
      if (warning) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Uwaga',
          detail: warning,
          life: 4000,
        });
      }
    });
  }

  ngOnInit(): void {
    this.tasksFacade.loadTasks();
    this.usersFacade.loadUsersDictionary();

    this.onEditTask();
    this.onChangeTaskStatus();
    this.onDeleteTask();
  }

  onAddTask(): void {
    this.currentUser$
      .pipe(
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
      )
      .subscribe(result => {
        if (result?.action === 'save') {
          console.log('New task data:', result.formValue);

          this.tasksFacade.createTask(result.formValue);

          this.messageService.add({
            severity: 'success',
            summary: 'Sukces',
            detail: 'Zadanie zostało dodane pomyślnie',
            life: 3000,
          });

          this.tasksFacade.loadTasks();
        }
      });
  }

  private onEditTask(): void {
    this.taskUiEvents.uiEvents$
      .pipe(
        filter(e => e.type === 'edit'),
        withLatestFrom(this.currentUser$),
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
        })
      )
      .subscribe(result => {
        if (result?.action === 'save') {
          this.tasksFacade.updateTask(result.taskId!, result.formValue);

          console.log('Updated task data:', result.formValue);

          this.messageService.add({
            severity: 'success',
            summary: 'Zapisano zmiany',
            detail: 'Zadanie zostało zaktualizowane',
            life: 3000,
          });

          this.tasksFacade.loadTasks();
        }
      });
  }

  private onChangeTaskStatus(): void {
    this.taskUiEvents.uiEvents$
      .pipe(
        filter(e => e.type === 'statusChange'),
        withLatestFrom(this.currentUser$),
        switchMap(([event, user]) => {
          if (!user) return EMPTY;

          const upperStatus = event.status.toUpperCase() as TaskStatus;
  
          this.tasksFacade.changeTaskStatus(event.taskId, upperStatus);
  
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Status zmieniony',
          detail: 'Status zadania został zmieniony pomyślnie',
          life: 2000,
        });
  
        this.tasksFacade.loadTasks();
      });
  }

  private onDeleteTask(): void {
    this.taskUiEvents.uiEvents$
      .pipe(
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
                data: { task }
              });
  
              return ref?.onClose ?? EMPTY;
            }),
            map(confirmed => ({ confirmed, taskId }))
          );
        }),
        filter(({ confirmed }) => confirmed)
      )
      .subscribe(({ taskId }) => {
        this.tasksFacade.deleteTask(taskId);
  
        this.messageService.add({
          severity: 'success',
          summary: 'Usunięto',
          detail: 'Zadanie zostało usunięte',
          life: 3000,
        });
  
        this.tasksFacade.loadTasks();
      });
  }
}
