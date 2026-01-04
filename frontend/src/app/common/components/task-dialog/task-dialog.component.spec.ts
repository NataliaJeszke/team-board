import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MockBuilder, MockInstance, MockProvider } from 'ng-mocks';

import { TaskDialogComponent } from './task-dialog.component';
import { TaskDialogUiService } from './service/task-dialog-ui.service';
import { Task, TaskDialogData } from '@feature/tasks/model/tasks.model';

describe('TaskDialogComponent', () => {
  MockInstance.scope();

  let component: TaskDialogComponent;
  let fixture: ComponentFixture<TaskDialogComponent>;
  let mockDialogRef: DynamicDialogRef;
  let mockDialogConfig: DynamicDialogConfig<TaskDialogData>;
  let taskDialogUiServiceCreateTaskFormMock: jest.Mock;
  let taskDialogUiServicePopulateFormMock: jest.Mock;
  let taskDialogUiServiceValidateFormMock: jest.Mock;
  let taskDialogUiServiceGetFormValueMock: jest.Mock;
  let taskDialogUiServiceIsFieldInvalidMock: jest.Mock;
  let taskDialogUiServiceGetFieldErrorMock: jest.Mock;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    status: 'todo',
    priority: 'medium',
    assignedToId: 1,
    createdById: 2,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  };

  const mockAvailableUsers = [
    { id: 1, name: 'User One' },
    { id: 2, name: 'User Two' },
  ];

  const mockForm = new FormGroup({});

  beforeEach(async () => {
    taskDialogUiServiceCreateTaskFormMock = jest.fn().mockReturnValue(mockForm);
    taskDialogUiServicePopulateFormMock = jest.fn();
    taskDialogUiServiceValidateFormMock = jest.fn().mockReturnValue(true);
    taskDialogUiServiceGetFormValueMock = jest.fn().mockReturnValue({
      title: 'Test Task',
      assignedToId: 1,
      priority: 'medium',
      status: 'todo',
    });
    taskDialogUiServiceIsFieldInvalidMock = jest.fn().mockReturnValue(false);
    taskDialogUiServiceGetFieldErrorMock = jest.fn().mockReturnValue(null);

    mockDialogRef = {
      close: jest.fn(),
    } as unknown as DynamicDialogRef;

    mockDialogConfig = {
      data: {
        task: null,
        availableUsers: mockAvailableUsers,
        currentUserId: 1,
      },
    } as unknown as DynamicDialogConfig<TaskDialogData>;

    MockInstance(TaskDialogUiService, () => ({
      createTaskForm: taskDialogUiServiceCreateTaskFormMock,
      populateForm: taskDialogUiServicePopulateFormMock,
      validateForm: taskDialogUiServiceValidateFormMock,
      getFormValue: taskDialogUiServiceGetFormValueMock,
      isFieldInvalid: taskDialogUiServiceIsFieldInvalidMock,
      getFieldError: taskDialogUiServiceGetFieldErrorMock,
      priorityOptions: [],
      statusOptions: [],
    }));

    return MockBuilder(TaskDialogComponent)
      .provide({
        provide: DynamicDialogRef,
        useValue: mockDialogRef,
      })
      .provide({
        provide: DynamicDialogConfig,
        useValue: mockDialogConfig,
      })
      .provide(MockProvider(TaskDialogUiService));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should throw error when dialog data is not provided', () => {
      // Arrange
      mockDialogConfig.data = undefined;

      // Act & Assert
      expect(() => {
        const newFixture = TestBed.createComponent(TaskDialogComponent);
        newFixture.detectChanges();
      }).toThrow('TaskDialogComponent: Dialog data is required');
    });

    it('should set availableUsers from dialog config', () => {
      // Assert
      expect(component.availableUsers).toEqual(mockAvailableUsers);
    });

    it('should set task to null when creating new task', () => {
      // Assert
      expect(component.task).toBeNull();
    });

    it('should set task when editing existing task', () => {
      // Arrange
      mockDialogConfig.data = {
        task: mockTask,
        availableUsers: mockAvailableUsers,
        currentUserId: 1,
      };

      const newFixture = TestBed.createComponent(TaskDialogComponent);
      const newComponent = newFixture.componentInstance;

      // Act
      newFixture.detectChanges();

      // Assert
      expect(newComponent.task).toEqual(mockTask);
    });

    it('should populate form when editing existing task', () => {
      // Arrange
      mockDialogConfig.data = {
        task: mockTask,
        availableUsers: mockAvailableUsers,
        currentUserId: 1,
      };

      const newFixture = TestBed.createComponent(TaskDialogComponent);
      const newComponent = newFixture.componentInstance;

      // Act
      newFixture.detectChanges();

      // Assert
      expect(taskDialogUiServicePopulateFormMock).toHaveBeenCalledWith(newComponent.taskForm, mockTask);
    });

    it('should not populate form when creating new task', () => {
      // Assert
      expect(taskDialogUiServicePopulateFormMock).not.toHaveBeenCalled();
    });
  });

  describe('isEditMode', () => {
    it('should return false when creating new task', () => {
      // Assert
      expect(component.isEditMode()).toBe(false);
    });

    it('should return true when editing existing task', () => {
      // Arrange
      mockDialogConfig.data = {
        task: mockTask,
        availableUsers: mockAvailableUsers,
        currentUserId: 1,
      };

      const newFixture = TestBed.createComponent(TaskDialogComponent);
      const newComponent = newFixture.componentInstance;

      // Act
      newFixture.detectChanges();

      // Assert
      expect(newComponent.isEditMode()).toBe(true);
    });
  });

  describe('onCancel', () => {
    it('should close dialog with cancel action', () => {
      // Act
      component.onCancel();

      // Assert
      expect(mockDialogRef.close).toHaveBeenCalledWith({ action: 'cancel' });
    });
  });

  describe('onSave', () => {
    it('should validate form before saving', () => {
      // Act
      component.onSave();

      // Assert
      expect(taskDialogUiServiceValidateFormMock).toHaveBeenCalledWith(mockForm);
    });

    it('should not close dialog when form is invalid', () => {
      // Arrange
      taskDialogUiServiceValidateFormMock.mockReturnValue(false);

      // Act
      component.onSave();

      // Assert
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should close dialog with save action and form value when form is valid', () => {
      // Arrange
      const formValue = {
        title: 'Test Task',
        assignedToId: 1,
        priority: 'medium',
        status: 'todo',
      };
      taskDialogUiServiceGetFormValueMock.mockReturnValue(formValue);

      // Act
      component.onSave();

      // Assert
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        action: 'save',
        formValue,
        taskId: undefined,
      });
    });

    it('should include taskId when editing existing task', () => {
      // Arrange
      mockDialogConfig.data = {
        task: mockTask,
        availableUsers: mockAvailableUsers,
        currentUserId: 1,
      };

      const newFixture = TestBed.createComponent(TaskDialogComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      const formValue = {
        title: 'Updated Task',
        assignedToId: 1,
        priority: 'high',
        status: 'in_progress',
      };
      taskDialogUiServiceGetFormValueMock.mockReturnValue(formValue);

      // Act
      newComponent.onSave();

      // Assert
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        action: 'save',
        formValue,
        taskId: mockTask.id,
      });
    });
  });

  describe('isFieldInvalid', () => {
    it('should call isFieldInvalid on service', () => {
      // Arrange
      const fieldName = 'title';

      // Act
      component.isFieldInvalid(fieldName);

      // Assert
      expect(taskDialogUiServiceIsFieldInvalidMock).toHaveBeenCalledWith(mockForm, fieldName);
    });

    it('should return result from service', () => {
      // Arrange
      taskDialogUiServiceIsFieldInvalidMock.mockReturnValue(true);

      // Act
      const result = component.isFieldInvalid('title');

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('getFieldError', () => {
    it('should call getFieldError on service', () => {
      // Arrange
      const fieldName = 'title';

      // Act
      component.getFieldError(fieldName);

      // Assert
      expect(taskDialogUiServiceGetFieldErrorMock).toHaveBeenCalledWith(mockForm, fieldName);
    });

    it('should return error message from service', () => {
      // Arrange
      const errorMessage = 'Field is required';
      taskDialogUiServiceGetFieldErrorMock.mockReturnValue(errorMessage);

      // Act
      const result = component.getFieldError('title');

      // Assert
      expect(result).toBe(errorMessage);
    });
  });
});
