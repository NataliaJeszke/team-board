import { Component, input, output, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { getInitialsFromName } from '@utils/index';

import { TaskService } from '@feature/tasks/service/task.service';
import { TaskPriority, TaskStatus, Task } from '@feature/tasks/tasks.model';

@Component({
  selector: 'tb-task',
  imports: [CardModule, ButtonModule, TagModule, AvatarModule, TooltipModule, DatePipe],
  providers: [TaskService],
  templateUrl: './task.component.html',
})
export class TaskComponent {
  private readonly taskService = inject(TaskService);

  task = input.required<Task>();
  currentUserId = input.required<number>();

  edit = output<Task>();
  delete = output<Task>();
  statusChange = output<{ task: Task; newStatus: TaskStatus }>();

  readonly isCreator = computed(() => this.task().createdById === this.currentUserId());
  readonly isAssignee = computed(() => this.task().assignedToId === this.currentUserId());
  readonly availableStatuses = computed(() => this.taskService.availableStatuses);

  readonly getInitials = getInitialsFromName;

  getPriorityLabel = (priority: TaskPriority) => this.taskService.getPriorityLabel(priority);
  getPrioritySeverity = (priority: TaskPriority) => this.taskService.getPrioritySeverity(priority);
  getStatusLabel = (status: TaskStatus) => this.taskService.getStatusLabel(status);
  getStatusSeverity = (status: TaskStatus) => this.taskService.getStatusSeverity(status);

  onEdit(): void {
    if (this.isCreator()) {
      this.edit.emit(this.task());
    }
  }

  onDelete(): void {
    if (this.isCreator()) {
      this.delete.emit(this.task());
    }
  }

  onStatusChange(newStatus: TaskStatus): void {
    this.statusChange.emit({ task: this.task(), newStatus });
  }
}
