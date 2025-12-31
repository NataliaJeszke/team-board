import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { TaskStatus, Task, TaskPriority, TaskFormValue } from '@feature/tasks/model/tasks.model';

@Injectable()
export class TaskDialogUiService {
  private readonly fb = inject(FormBuilder);

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

  createTaskForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      assignedToId: [null as number | null],
      priority: ['medium' as TaskPriority, Validators.required],
      status: ['todo' as TaskStatus, Validators.required],
    });
  }

  populateForm(form: FormGroup, task: Task): void {
    form.patchValue({
      title: task.title,
      assignedToId: task.assignedToId,
      priority: task.priority,
      status: task.status,
    });
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(form: FormGroup, fieldName: string): string | null {
    const field = form.get(fieldName);

    if (!field || !field.errors) {
      return null;
    }

    return this.mapErrorToMessage(field);
  }

  validateForm(form: FormGroup): boolean {
    if (form.invalid) {
      form.markAllAsTouched();
      return false;
    }
    return true;
  }

  getFormValue(form: FormGroup): TaskFormValue {
    return form.value as TaskFormValue;
  }

  resetForm(form: FormGroup): void {
    form.reset({
      title: '',
      assignedToId: null,
      priority: 'medium' as TaskPriority,
      status: 'todo' as TaskStatus,
    });
  }

  isFormDirty(form: FormGroup): boolean {
    return form.dirty;
  }

  getPriorityLabel(priority: TaskPriority): string {
    const option = this.priorityOptions.find(opt => opt.value === priority);
    return option?.label ?? priority;
  }

  getStatusLabel(status: TaskStatus): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option?.label ?? status;
  }

  private mapErrorToMessage(field: AbstractControl): string | null {
    const errors = field.errors;

    if (!errors) {
      return null;
    }

    if (errors['required']) {
      return 'To pole jest wymagane';
    }

    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      const actualLength = errors['minlength'].actualLength;
      return `Minimalna długość: ${minLength} znaków (podano: ${actualLength})`;
    }

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      const actualLength = errors['maxlength'].actualLength;
      return `Maksymalna długość: ${maxLength} znaków (podano: ${actualLength})`;
    }

    if (errors['email']) {
      return 'Nieprawidłowy format email';
    }

    if (errors['pattern']) {
      return 'Nieprawidłowy format';
    }

    return 'Nieprawidłowa wartość';
  }
}
