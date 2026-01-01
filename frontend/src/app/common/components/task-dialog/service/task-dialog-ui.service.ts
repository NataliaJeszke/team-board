import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TaskStatus, Task, TaskPriority, TaskFormValue } from '@feature/tasks/model/tasks.model';

@Injectable()
export class TaskDialogUiService {
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);

  get priorityOptions() {
    return [
      {
        value: 'low' as TaskPriority,
        label: this.translate.instant('common.components.task-dialog.priority.low'),
      },
      {
        value: 'medium' as TaskPriority,
        label: this.translate.instant('common.components.task-dialog.priority.medium'),
      },
      {
        value: 'high' as TaskPriority,
        label: this.translate.instant('common.components.task-dialog.priority.high'),
      },
    ];
  }

  get statusOptions() {
    return [
      {
        value: 'todo' as TaskStatus,
        label: this.translate.instant('common.components.task-dialog.status.todo'),
      },
      {
        value: 'in_progress' as TaskStatus,
        label: this.translate.instant('common.components.task-dialog.status.in_progress'),
      },
      {
        value: 'delayed' as TaskStatus,
        label: this.translate.instant('common.components.task-dialog.status.delayed'),
      },
      {
        value: 'done' as TaskStatus,
        label: this.translate.instant('common.components.task-dialog.status.done'),
      },
    ];
  }

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
    if (!field || !field.errors) return null;
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
    if (!errors) return null;

    if (errors['required'])
      return this.translate.instant('common.components.task-dialog.validation.required');
    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      const actualLength = errors['minlength'].actualLength;
      return this.translate.instant('common.components.task-dialog.validation.minlength', {
        min: minLength,
        actual: actualLength,
      });
    }
    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      const actualLength = errors['maxlength'].actualLength;
      return this.translate.instant('common.components.task-dialog.validation.maxlength', {
        max: maxLength,
        actual: actualLength,
      });
    }
    if (errors['email'])
      return this.translate.instant('common.components.task-dialog.validation.email');
    if (errors['pattern'])
      return this.translate.instant('common.components.task-dialog.validation.pattern');

    return this.translate.instant('common.components.task-dialog.validation.invalid');
  }
}
