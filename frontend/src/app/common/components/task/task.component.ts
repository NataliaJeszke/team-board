import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

import { Task, TaskPriority, TaskStatus } from '@core/models/task.model';

@Component({
  selector: 'tb-task',
  imports: [
    CardModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    TooltipModule,
    DatePipe
  ],
  templateUrl: './task.component.html',
})
export class TaskComponent {
  task = input.required<Task>();
  currentUserId = input.required<number>();
  
  edit = output<Task>();
  delete = output<Task>();
  statusChange = output<{ task: Task; newStatus: TaskStatus }>();

  readonly availableStatuses: TaskStatus[] = [
    'todo',
    'in_progress',
    'done',
  ];

  get isCreator(): boolean {
    return this.task().createdById === this.currentUserId();
  }

  get isAssignee(): boolean {
    return this.task().assignedToId === this.currentUserId();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

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

  onEdit(): void {
    if (this.isCreator) {
      this.edit.emit(this.task());
    }
  }

  onDelete(): void {
    if (this.isCreator) {
      this.delete.emit(this.task());
    }
  }

  onStatusChange(newStatus: TaskStatus): void {
    this.statusChange.emit({ task: this.task(), newStatus });
  }
}