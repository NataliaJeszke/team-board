import { Component, input, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { getInitialsFromName } from '@utils/index';

import { TaskPriority, TaskStatus, Task } from '@feature/tasks/model/tasks.model';

import { TaskUiService } from '@common/components/task/service/task-ui.service';
import { TaskUiEventsService } from '@common/components/task/service/task-ui-events.service';

@Component({
  selector: 'tb-task',
  imports: [
    DatePipe,
    TagModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    TranslateModule,
  ],
  providers: [TaskUiService],
  templateUrl: './task.component.html',
})
export class TaskComponent {
  private readonly taskUiService = inject(TaskUiService);
  private readonly taskUiEvents = inject(TaskUiEventsService);

  task_ = input.required<Task>();
  currentUserId_ = input.required<number>();

  readonly isCreator = computed(() => this.task_().createdById === this.currentUserId_());
  readonly isAssignee = computed(() => this.task_().assignedToId === this.currentUserId_());
  readonly availableStatuses = computed(() => this.taskUiService.availableStatuses);

  readonly getInitials = getInitialsFromName;

  getPriorityLabel = (priority: TaskPriority) => this.taskUiService.getPriorityLabel(priority);
  getPrioritySeverity = (priority: TaskPriority) =>
    this.taskUiService.getPrioritySeverity(priority);
  getStatusLabel = (status: TaskStatus) => this.taskUiService.getStatusLabel(status);
  getStatusSeverity = (status: TaskStatus) => this.taskUiService.getStatusSeverity(status);

  onEdit(): void {
    if (this.isCreator()) {
      this.taskUiEvents.edit(this.task_());
    }
  }

  onDelete(): void {
    if (this.isCreator()) {
      this.taskUiEvents.delete(this.task_().id);
    }
  }

  onStatusChange(newStatus: TaskStatus): void {
    this.taskUiEvents.changeStatus(this.task_().id, newStatus);
  }
}
