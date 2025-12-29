/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';

import { Task, TaskPriority, TaskStatus } from '@feature/tasks/tasks.model';
import { TasksFacade } from '@feature/tasks/tasks.facade';
import { TaskService } from '@feature/tasks/service/task.service';

interface TaskFormValue {
  title: string;
  assignedToId: number | null;
  priority: TaskPriority;
  status: TaskStatus;
}

interface UserOption {
  id: number;
  name: string;
}

interface TaskDialogData {
  task?: Task | null;
  availableUsers: UserOption[];
  currentUserId: number;
}

@Component({
  selector: 'tb-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    Select,
  ],
  providers: [TaskService],
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tasksFacade = inject(TasksFacade);
  private readonly taskService = inject(TaskService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig<TaskDialogData>);

  // Data from dialog config
  task: Task | null = null;
  availableUsers: UserOption[] = [];
  currentUserId = 0;
  isEditMode = false;

  // Form
  taskForm!: FormGroup<{
    title: any;
    assignedToId: any;
    priority: any;
    status: any;
  }>;

  // Dropdown options
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
    // Get data from config
    this.task = this.config.data?.task ?? null;
    this.availableUsers = this.config.data?.availableUsers ?? [];
    this.currentUserId = this.config.data?.currentUserId ?? 0;
    this.isEditMode = this.task !== null;

    // Initialize form
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      assignedToId: [null as number | null, Validators.required],
      priority: ['medium' as TaskPriority, Validators.required],
      status: ['todo' as TaskStatus, Validators.required],
    });

    // Populate form if editing
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
    this.ref.close();
  }

  onSave(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value as TaskFormValue;

    if (this.isEditMode && this.task) {
      // Edit mode
      this.tasksFacade.updateTask(this.task.id, {
        title: formValue.title,
        assignedToId: formValue.assignedToId!,
        priority: formValue.priority,
        status: formValue.status,
        updatedAt: new Date(),
      });
    } else {
      // Create mode
      this.tasksFacade.createTask({
        title: formValue.title,
        assignedToId: formValue.assignedToId!,
        createdById: this.currentUserId,
        priority: formValue.priority,
        status: formValue.status,
        updatedAt: new Date(),
      });
    }

    this.ref.close({ saved: true });
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