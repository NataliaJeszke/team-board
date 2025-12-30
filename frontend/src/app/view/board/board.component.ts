import { Component, effect, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EMPTY, first, switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { AuthFacade } from '@core/auth/auth.facade';

import { TasksFacade } from '@feature/tasks/tasks.facade';

import { HeaderComponent } from '@common/components/header/header.component';
import { TaskDialogComponent } from '@common/components/task-dialog/task-dialog.component';
import { UserTasksComponent } from '@common/components/user-tasks-list/user-tasks-list.component';

@Component({
  selector: 'tb-board',
  templateUrl: './board.component.html',
  imports: [AsyncPipe, ButtonModule, HeaderComponent, UserTasksComponent, ToastModule],
  providers: [DialogService, MessageService],
})
export class BoardComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  protected readonly tasksFacade = inject(TasksFacade);

  readonly currentUser$ = this.authFacade.user$;

  constructor() {
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
  }

  onAddTask(): void {
    this.currentUser$
      .pipe(
        first(Boolean),
        switchMap(user => {
          const ref = this.dialogService.open(TaskDialogComponent, {
            header: 'Dodaj nowe zadanie',
            width: '500px',
            data: { currentUserId: user.id, task: null },
          });
          return ref?.onClose ?? EMPTY;
        })
      )
      .subscribe(result => {
        if (result?.action === 'save') {
          console.log('New task data:', result.formValue);

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

  // onAddTask(): void {
  //   this.currentUser$
  //     .pipe(
  //       first(Boolean),
  //       switchMap(user => {
  //         // ✅ Załaduj userów przed otwarciem dialogu
  //         return this.userFacade.getUsers().pipe(
  //           map(users => ({ user, users }))
  //         );
  //       }),
  //       switchMap(({ user, users }) => {
  //         const ref = this.dialogService.open(TaskDialogComponent, {
  //           header: 'Dodaj nowe zadanie',
  //           width: '500px',
  //           data: {
  //             task: null,
  //             currentUserId: user.id,
  //             availableUsers: users.map(u => ({ id: u.id, name: u.name }))
  //           } as TaskDialogData,
  //         });

  //         return ref.onClose ?? EMPTY;
  //       })
  //     )
  //     .subscribe(result => {
  //       if (result?.action === 'save') {
  //         this.handleCreateTask(result.formValue);
  //       }
  //     });
  // }
}
