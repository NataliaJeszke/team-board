import { Component, effect, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { AuthFacade } from '@core/auth/auth.facade';

import { TasksFacade } from '@feature/tasks/tasks.facade';
import { UsersFacade } from '@feature/users/users.facade';

import { HeaderComponent } from '@common/components/header/header.component';
import { UserTasksComponent } from '@common/components/user-tasks-list/user-tasks-list.component';

import { BoardService } from './service/board.service';


@Component({
  selector: 'tb-board',
  templateUrl: './board.component.html',
  imports: [AsyncPipe, ButtonModule, HeaderComponent, UserTasksComponent, ToastModule],
  providers: [DialogService, MessageService, BoardService],
})
export class BoardComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly usersFacade = inject(UsersFacade);
  protected readonly tasksFacade = inject(TasksFacade);

  private readonly boardService = inject(BoardService);
  private readonly messageService = inject(MessageService);

  readonly currentUser$ = this.authFacade.user$;
  readonly usersDictionary = this.usersFacade.dictionary;

  constructor() {
    effect(() => {
      const error = this.tasksFacade.error();
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
      const warning = this.tasksFacade.warning();
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
    this.boardService.initializeData();
    this.subscribeToUiEvents();
  }

  onAddTask(): void {
    this.boardService.handleAddTaskDialog(this.currentUser$).subscribe(result => {
      this.messageService.add(result);
    });
  }

  private subscribeToUiEvents(): void {
    this.boardService
      .handleEditTaskEvents(this.currentUser$)
      .subscribe(result => this.messageService.add(result));

    this.boardService
      .handleStatusChangeEvents(this.currentUser$)
      .subscribe(result => this.messageService.add(result));

    this.boardService
      .handleDeleteTaskEvents()
      .subscribe(result => this.messageService.add(result));
  }
}