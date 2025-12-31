import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { Task } from '@feature/tasks/model/tasks.model';

import { ConfirmDialogData } from './model/confirm-dialog.model';

@Component({
  selector: 'tb-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig<ConfirmDialogData>);

  task!: Task;
  message!: string;

  ngOnInit(): void {
    if (!this.config.data || !this.config.data.task) {
      this.ref.close(false);
      return;
    }

    this.task = this.config.data.task;
    this.message =
      this.config.data.message || `Czy na pewno chcesz usunąć zadanie "${this.task.title}"?`;
  }

  confirm(): void {
    this.ref.close(true);
  }

  cancel(): void {
    this.ref.close(false);
  }
}
