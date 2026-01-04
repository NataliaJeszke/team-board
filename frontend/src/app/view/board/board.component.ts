import { Component, computed, effect, inject, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { AuthFacade } from '@core/auth/auth.facade';

import { TasksFacade } from '@feature/tasks/tasks.facade';
import { UsersDictionaryFacade } from '@feature/users-dictionary/users-dictionary.facade';

import { FilterValues } from '@common/components/filters/model/filters.model';
import { HeaderComponent } from '@common/components/header/header.component';
import { FiltersComponent } from '@common/components/filters/filters.component';
import { UserTasksComponent } from '@common/components/user-tasks-list/user-tasks-list.component';

import { BoardService } from './service/board.service';

@Component({
  selector: 'tb-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  imports: [ButtonModule, HeaderComponent, UserTasksComponent, ToastModule, FiltersComponent],
  providers: [DialogService, MessageService, BoardService],
})
export class BoardComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly usersDictionaryFacade = inject(UsersDictionaryFacade);
  protected readonly tasksFacade = inject(TasksFacade);

  private readonly boardService = inject(BoardService);
  private readonly messageService = inject(MessageService);

  readonly currentUser = this.authFacade.user;
  readonly usersDictionary = this.usersDictionaryFacade.dictionary;

  readonly taskFiltersConfig = computed(() => {
    return this.boardService.getFiltersConfig();
  });

  constructor() {
    effect(() => {
      const error = this.tasksFacade.error();
      if (error) {
        this.messageService.add({
          severity: 'error',
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
          detail: warning,
          life: 4000,
        });
      }
    });
  }

  ngOnInit(): void {
    this.boardService.initializeData();
    this.subscribeToUiTaskEvents();
  }

  onAddTask(): void {
    this.boardService.handleAddTaskDialog(this.currentUser()).subscribe(result => {
      this.messageService.add(result);
    });
  }

  onFiltersChanged(filters: FilterValues): void {
    this.boardService.applyFilters(filters);
  }

  onFiltersReset(): void {
    this.boardService.resetFilters();
  }

  private subscribeToUiTaskEvents(): void {
    const user = this.currentUser();

    this.boardService
      .handleEditTaskEvents(user)
      .subscribe(result => this.messageService.add(result));

    this.boardService
      .handleStatusChangeEvents(user)
      .subscribe(result => this.messageService.add(result));

    this.boardService.handleDeleteTaskEvents().subscribe(result => this.messageService.add(result));
  }
}
