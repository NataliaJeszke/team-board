import { Injectable } from '@angular/core';

import { TaskPriority, TaskStatus } from '@feature/tasks/model/tasks.model';

@Injectable()
export class TaskUiService {
  readonly availableStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];

  getPriorityLabel(priority: TaskPriority): string {
    const labels: Record<TaskPriority, string> = {
      low: 'Niski',
      medium: 'Średni',
      high: 'Wysoki',
    };
    return labels[priority];
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
    const labels: Record<TaskStatus, string> = {
      todo: 'Do zrobienia',
      in_progress: 'W trakcie',
      delayed: 'Opóźnione',
      done: 'Gotowe',
    };
    return labels[status];
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
