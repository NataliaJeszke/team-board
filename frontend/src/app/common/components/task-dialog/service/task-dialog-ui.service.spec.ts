import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MockInstance, MockProvider } from 'ng-mocks';

import { TaskDialogUiService } from './task-dialog-ui.service';
import { Task } from '@feature/tasks/model/tasks.model';
import { TASK_PRIORITY, TASK_STATUS } from '../constants/task-dialog.constants';

describe('TaskDialogUiService', () => {
  MockInstance.scope();

  let service: TaskDialogUiService;
  let translateInstantMock: jest.Mock;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    status: 'in_progress',
    priority: 'high',
    assignedToId: 1,
    createdById: 2,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  };

  beforeEach(() => {
    translateInstantMock = jest.fn((key: string, params?: object) => {
      if (params) {
        return `translated_${key}_${JSON.stringify(params)}`;
      }
      return `translated_${key}`;
    });

    MockInstance(TranslateService, () => ({
      instant: translateInstantMock,
    }));

    TestBed.configureTestingModule({
      providers: [MockProvider(TranslateService), FormBuilder, TaskDialogUiService],
    });

    service = TestBed.inject(TaskDialogUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('priorityOptions', () => {
    it('should have translated priority options', () => {
      // Assert
      expect(service.priorityOptions.length).toBeGreaterThan(0);
      expect(service.priorityOptions[0].value).toBeDefined();
      expect(service.priorityOptions[0].labelKey).toBeDefined();
      expect(service.priorityOptions[0].label).toBeDefined();
    });
  });

  describe('statusOptions', () => {
    it('should have translated status options', () => {
      // Assert
      expect(service.statusOptions.length).toBeGreaterThan(0);
      expect(service.statusOptions[0].value).toBeDefined();
      expect(service.statusOptions[0].labelKey).toBeDefined();
      expect(service.statusOptions[0].label).toBeDefined();
    });
  });

  describe('createTaskForm', () => {
    it('should create form with all required controls', () => {
      // Act
      const form = service.createTaskForm();

      // Assert
      expect(form.get('title')).toBeTruthy();
      expect(form.get('assignedToId')).toBeTruthy();
      expect(form.get('priority')).toBeTruthy();
      expect(form.get('status')).toBeTruthy();
    });

    it('should set default values for priority and status', () => {
      // Act
      const form = service.createTaskForm();

      // Assert
      expect(form.get('priority')?.value).toBe(TASK_PRIORITY.MEDIUM);
      expect(form.get('status')?.value).toBe(TASK_STATUS.TODO);
    });

    it('should set title as required', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');

      // Act
      titleControl?.setValue('');

      // Assert
      expect(titleControl?.hasError('required')).toBe(true);
    });

    it('should validate title minimum length', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');

      // Act
      titleControl?.setValue('ab');

      // Assert
      expect(titleControl?.hasError('minlength')).toBe(true);
    });

    it('should validate title maximum length', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');

      // Act
      titleControl?.setValue('a'.repeat(101));

      // Assert
      expect(titleControl?.hasError('maxlength')).toBe(true);
    });
  });

  describe('populateForm', () => {
    it('should populate form with task data', () => {
      // Arrange
      const form = service.createTaskForm();

      // Act
      service.populateForm(form, mockTask);

      // Assert
      expect(form.get('title')?.value).toBe(mockTask.title);
      expect(form.get('assignedToId')?.value).toBe(mockTask.assignedToId);
      expect(form.get('priority')?.value).toBe(mockTask.priority);
      expect(form.get('status')?.value).toBe(mockTask.status);
    });
  });

  describe('isFieldInvalid', () => {
    it('should return true when field is invalid and touched', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');
      titleControl?.setValue('');
      titleControl?.markAsTouched();

      // Act
      const result = service.isFieldInvalid(form, 'title');

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when field is invalid and dirty', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');
      titleControl?.setValue('');
      titleControl?.markAsDirty();

      // Act
      const result = service.isFieldInvalid(form, 'title');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when field is valid', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');
      titleControl?.setValue('Valid Title');
      titleControl?.markAsTouched();

      // Act
      const result = service.isFieldInvalid(form, 'title');

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when field is invalid but not touched or dirty', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');
      titleControl?.setValue('');

      // Act
      const result = service.isFieldInvalid(form, 'title');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getFieldError', () => {
    it('should return null when field has no errors', () => {
      // Arrange
      const form = service.createTaskForm();
      form.get('title')?.setValue('Valid Title');

      // Act
      const result = service.getFieldError(form, 'title');

      // Assert
      expect(result).toBeNull();
    });

    it('should return translated required error message', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');
      titleControl?.setValue('');
      titleControl?.markAsTouched();

      // Act
      const result = service.getFieldError(form, 'title');

      // Assert
      expect(result).toBe('translated_common.components.task-dialog.validation.required');
    });

    it('should return translated minlength error message with parameters', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');
      titleControl?.setValue('ab');
      titleControl?.markAsTouched();

      // Act
      const result = service.getFieldError(form, 'title');

      // Assert
      expect(result).toContain('translated_common.components.task-dialog.validation.minlength');
    });

    it('should return translated maxlength error message with parameters', () => {
      // Arrange
      const form = service.createTaskForm();
      const titleControl = form.get('title');
      titleControl?.setValue('a'.repeat(101));
      titleControl?.markAsTouched();

      // Act
      const result = service.getFieldError(form, 'title');

      // Assert
      expect(result).toContain('translated_common.components.task-dialog.validation.maxlength');
    });
  });

  describe('validateForm', () => {
    it('should return true when form is valid', () => {
      // Arrange
      const form = service.createTaskForm();
      form.get('title')?.setValue('Valid Task Title');

      // Act
      const result = service.validateForm(form);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when form is invalid', () => {
      // Arrange
      const form = service.createTaskForm();
      form.get('title')?.setValue('');

      // Act
      const result = service.validateForm(form);

      // Assert
      expect(result).toBe(false);
    });

    it('should mark all fields as touched when form is invalid', () => {
      // Arrange
      const form = service.createTaskForm();
      form.get('title')?.setValue('');

      // Act
      service.validateForm(form);

      // Assert
      expect(form.get('title')?.touched).toBe(true);
      expect(form.get('assignedToId')?.touched).toBe(true);
      expect(form.get('priority')?.touched).toBe(true);
      expect(form.get('status')?.touched).toBe(true);
    });
  });

  describe('getFormValue', () => {
    it('should return form value', () => {
      // Arrange
      const form = service.createTaskForm();
      form.get('title')?.setValue('Test Task');
      form.get('assignedToId')?.setValue(5);

      // Act
      const result = service.getFormValue(form);

      // Assert
      expect(result.title).toBe('Test Task');
      expect(result.assignedToId).toBe(5);
    });
  });

  describe('resetForm', () => {
    it('should reset form to default values', () => {
      // Arrange
      const form = service.createTaskForm();
      form.get('title')?.setValue('Modified Title');
      form.get('assignedToId')?.setValue(5);
      form.get('priority')?.setValue('high');
      form.get('status')?.setValue('done');

      // Act
      service.resetForm(form);

      // Assert
      expect(form.get('title')?.value).toBe('');
      expect(form.get('assignedToId')?.value).toBeNull();
      expect(form.get('priority')?.value).toBe(TASK_PRIORITY.MEDIUM);
      expect(form.get('status')?.value).toBe(TASK_STATUS.TODO);
    });
  });

  describe('isFormDirty', () => {
    it('should return true when form is dirty', () => {
      // Arrange
      const form = service.createTaskForm();
      form.get('title')?.setValue('Modified');
      form.markAsDirty();

      // Act
      const result = service.isFormDirty(form);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when form is not dirty', () => {
      // Arrange
      const form = service.createTaskForm();

      // Act
      const result = service.isFormDirty(form);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getPriorityLabel', () => {
    it('should return translated label for existing priority', () => {
      // Act
      const result = service.getPriorityLabel('high');

      // Assert
      expect(result).toContain('translated_');
    });

    it('should return priority value when option not found', () => {
      // Act
      const result = service.getPriorityLabel('unknown' as 'low' | 'medium' | 'high');

      // Assert
      expect(result).toBe('unknown');
    });
  });

  describe('getStatusLabel', () => {
    it('should return translated label for existing status', () => {
      // Act
      const result = service.getStatusLabel('todo');

      // Assert
      expect(result).toContain('translated_');
    });

    it('should return status value when option not found', () => {
      // Act
      const result = service.getStatusLabel('unknown' as 'todo' | 'in_progress' | 'delayed' | 'done');

      // Assert
      expect(result).toBe('unknown');
    });
  });
});
