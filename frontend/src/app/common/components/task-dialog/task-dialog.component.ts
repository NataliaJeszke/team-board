import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { UserDictionary } from '@core/api/models/users/users-api.model';

import { Task, TaskDialogData, TaskDialogResult } from '@feature/tasks/model/tasks.model';

import { TaskDialogUiService } from './service/task-dialog-ui.service';

@Component({
  selector: 'tb-task-dialog',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, TranslateModule],
  providers: [TaskDialogUiService],
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig<TaskDialogData>);
  readonly taskDialogUiService = inject(TaskDialogUiService);

  readonly taskForm: FormGroup = this.taskDialogUiService.createTaskForm();

  task: Task | null = null;
  availableUsers: UserDictionary[] = [];

  private currentUserId!: number;

  ngOnInit(): void {
    if (!this.config.data) {
      throw new Error('TaskDialogComponent: Dialog data is required');
    }

    this.task = this.config.data.task;
    this.availableUsers = this.config.data.availableUsers;
    this.currentUserId = this.config.data.currentUserId;

    if (this.task) {
      this.taskDialogUiService.populateForm(this.taskForm, this.task);
    }
  }

  isEditMode = () => this.task !== null;
  priorityOptions = () => this.taskDialogUiService.priorityOptions;
  statusOptions = () => this.taskDialogUiService.statusOptions;

  onCancel(): void {
    this.ref.close({ action: 'cancel' } as TaskDialogResult);
  }

  onSave(): void {
    if (!this.taskDialogUiService.validateForm(this.taskForm)) {
      return;
    }

    const formValue = this.taskDialogUiService.getFormValue(this.taskForm);

    const result: TaskDialogResult = {
      action: 'save',
      formValue,
      taskId: this.task?.id,
    };

    this.ref.close(result);
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.taskDialogUiService.isFieldInvalid(this.taskForm, fieldName);
  }

  getFieldError(fieldName: string): string | null {
    return this.taskDialogUiService.getFieldError(this.taskForm, fieldName);
  }
}
