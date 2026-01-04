import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { Task } from '@feature/tasks/model/tasks.model';

import { ConfirmDialogData } from './model/confirm-dialog.model';
import { CONFIRM_DIALOG_DEFAULT_MESSAGE } from './constants/confirm-dialog.constants';

@Component({
  selector: 'tb-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig<ConfirmDialogData>);
  private readonly translate = inject(TranslateService);

  task!: Task;
  message!: string;

  ngOnInit(): void {
    if (!this.config.data || !this.config.data.task) {
      this.ref.close(false);
      return;
    }

    this.task = this.config.data.task;
    this.message =
      this.config.data.message ||
      this.translate.instant(CONFIRM_DIALOG_DEFAULT_MESSAGE, { title: this.task.title });
  }

  confirm(): void {
    this.ref.close(true);
  }

  cancel(): void {
    this.ref.close(false);
  }
}
