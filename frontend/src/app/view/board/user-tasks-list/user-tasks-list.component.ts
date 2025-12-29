import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';

import { Task, TaskStatus } from '@feature/tasks/task.model';
import { TasksFacade } from '@feature/tasks/task.facade';

import { TaskComponent } from '@common/components/task/task.component';
import { AuthFacade } from '@core/auth/auth.facade';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tb-user-tasks',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule, BadgeModule, TranslateModule, TaskComponent],
  templateUrl: './user-tasks-list.component.html',
})
export class UserTasksComponent implements OnInit {
  protected readonly tasksFacade = inject(TasksFacade);
  protected readonly authFacade = inject (AuthFacade);

  private readonly user = toSignal(this.authFacade.user$);
  
  protected readonly currentUserId = computed<number | null>(() => {
    const user = this.user();
    return user ? user.id : null;
  });

  constructor() {
    effect(() => {
      console.log('📦 Tasks from facade:', this.tasksFacade.tasks$());
    });
  }

  ngOnInit(): void {
    this.tasksFacade.loadTasks();
  }

  onEdit(task: Task): void {
    // TODO: Open edit dialog
    console.log('Edit task:', task);
  }

  onDelete(task: Task): void {
    this.tasksFacade.deleteTask(task.id);
  }

  onStatusChange(event: { task: Task; newStatus: TaskStatus }): void {
    this.tasksFacade.changeTaskStatus(event.task.id, event.newStatus);
  }
}
