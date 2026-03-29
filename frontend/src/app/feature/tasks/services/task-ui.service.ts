import { Injectable, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { TaskPriority, TaskStatus } from '@feature/tasks/model/tasks.model';

@Injectable()
export class TaskUiService {
  private readonly translate = inject(TranslateService);

  readonly availableStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];

  getPriorityLabel(priority: TaskPriority): string {
    return this.translate.instant(`common.components.task.priority.${priority}`);
  }

  getPrioritySeverity(priority: TaskPriority): 'success' | 'info' | 'danger' {
    const severities: Record<TaskPriority, 'success' | 'info' | 'danger'> = {
      low: 'success',
      medium: 'info',
      high: 'danger',
    };
    return severities[priority];
  }

  getStatusLabel(status: TaskStatus): string {
    return this.translate.instant(`common.components.task.status.${status}`);
  }

  getStatusSeverity(status: TaskStatus): 'secondary' | 'info' | 'warn' | 'success' {
    const severities: Record<TaskStatus, 'secondary' | 'info' | 'warn' | 'success'> = {
      todo: 'secondary',
      in_progress: 'info',
      delayed: 'warn',
      done: 'success',
    };
    return severities[status];
  }

  canEdit(task: { createdById: number }, currentUserId: number): boolean {
    return task.createdById === currentUserId;
  }

  canChangeStatus(
    task: { createdById: number; assignedToId: number },
    currentUserId: number
  ): boolean {
    return task.createdById === currentUserId || task.assignedToId === currentUserId;
  }
}
