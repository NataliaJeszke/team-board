import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { UserDictionary } from '@core/api/models/users/users-api.model';

import { TaskStatus, Task, TaskPriority, TaskDialogData, TaskDialogResult, TaskFormValue } from '@feature/tasks/tasks.model';


export interface MockUser {
  id: number;
  name: string;
}

@Component({
  selector: 'tb-task-dialog',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig<TaskDialogData>);

  task: Task | null = null;
  availableUsers: UserDictionary[] = [];
  currentUserId = 0;

  get isEditMode(): boolean {
    return this.task !== null;
  }

  taskForm!: FormGroup;

  readonly priorityOptions = [
    { value: 'low' as TaskPriority, label: 'Niski' },
    { value: 'medium' as TaskPriority, label: 'Średni' },
    { value: 'high' as TaskPriority, label: 'Wysoki' },
  ];

  readonly statusOptions = [
    { value: 'todo' as TaskStatus, label: 'Do zrobienia' },
    { value: 'in_progress' as TaskStatus, label: 'W trakcie' },
    { value: 'delayed' as TaskStatus, label: 'Opóźnione' },
    { value: 'done' as TaskStatus, label: 'Gotowe' },
  ];

  ngOnInit(): void {
    this.task = this.config.data?.task ?? null;
    this.availableUsers = this.config.data?.availableUsers ?? [];
    this.currentUserId = this.config.data?.currentUserId ?? 0;

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      assignedToId: [null as number | null],
      priority: ['medium' as TaskPriority, Validators.required],
      status: ['todo' as TaskStatus, Validators.required],
    });

    if (this.task) {
      this.populateForm(this.task);
    }
  }

  private populateForm(task: Task): void {
    this.taskForm.patchValue({
      title: task.title,
      assignedToId: task.assignedToId,
      priority: task.priority,
      status: task.status,
    });
  }

  onCancel(): void {
    this.ref.close({ action: 'cancel' } as TaskDialogResult);
  }

  onSave(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value as TaskFormValue;

    const result: TaskDialogResult = {
      action: 'save',
      formValue,
      taskId: this.task?.id,
    };

    this.ref.close(result);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.taskForm.get(fieldName);

    if (!field || !field.errors) {
      return null;
    }

    if (field.errors['required']) {
      return 'To pole jest wymagane';
    }

    if (field.errors['minlength']) {
      return `Minimalna długość: ${field.errors['minlength'].requiredLength} znaków`;
    }

    if (field.errors['maxlength']) {
      return `Maksymalna długość: ${field.errors['maxlength'].requiredLength} znaków`;
    }

    return null;
  }
}
