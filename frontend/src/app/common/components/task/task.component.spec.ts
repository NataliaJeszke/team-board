import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockBuilder, MockInstance, MockProvider } from 'ng-mocks';

import { TaskComponent } from './task.component';
import { TaskUiService } from './service/task-ui.service';
import { TaskUiEventsService } from './service/task-ui-events.service';
import { Task } from '@feature/tasks/model/tasks.model';

describe('TaskComponent', () => {
  MockInstance.scope();

  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let taskUiServiceGetPriorityLabelMock: jest.Mock;
  let taskUiServiceGetPrioritySeverityMock: jest.Mock;
  let taskUiServiceGetStatusLabelMock: jest.Mock;
  let taskUiServiceGetStatusSeverityMock: jest.Mock;
  let taskUiEventsEditMock: jest.Mock;
  let taskUiEventsDeleteMock: jest.Mock;
  let taskUiEventsChangeStatusMock: jest.Mock;

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

  beforeEach(async () => {
    taskUiServiceGetPriorityLabelMock = jest.fn((priority: string) => `priority_${priority}`);
    taskUiServiceGetPrioritySeverityMock = jest.fn(() => 'info' as const);
    taskUiServiceGetStatusLabelMock = jest.fn((status: string) => `status_${status}`);
    taskUiServiceGetStatusSeverityMock = jest.fn(() => 'secondary' as const);
    taskUiEventsEditMock = jest.fn();
    taskUiEventsDeleteMock = jest.fn();
    taskUiEventsChangeStatusMock = jest.fn();

    MockInstance(TaskUiService, () => ({
      getPriorityLabel: taskUiServiceGetPriorityLabelMock,
      getPrioritySeverity: taskUiServiceGetPrioritySeverityMock,
      getStatusLabel: taskUiServiceGetStatusLabelMock,
      getStatusSeverity: taskUiServiceGetStatusSeverityMock,
      availableStatuses: ['todo', 'in_progress', 'done'] as ('todo' | 'in_progress' | 'delayed' | 'done')[],
    }));

    MockInstance(TaskUiEventsService, () => ({
      edit: taskUiEventsEditMock,
      delete: taskUiEventsDeleteMock,
      changeStatus: taskUiEventsChangeStatusMock,
    }));

    return MockBuilder(TaskComponent)
      .provide(MockProvider(TaskUiService))
      .provide(MockProvider(TaskUiEventsService));
  });

  beforeEach(() => {
  fixture = TestBed.createComponent(TaskComponent);
  component = fixture.componentInstance;

  fixture.componentRef.setInput('task_', mockTask);
  fixture.componentRef.setInput('currentUserId_', 2);
  
  fixture.detectChanges();
});

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('component inputs', () => {
    it('should accept task_ input', () => {
      // Assert
      expect(component.task_()).toEqual(mockTask);
    });

    it('should accept currentUserId_ input', () => {
      // Assert
      expect(component.currentUserId_()).toBe(2);
    });
  });

  describe('computed properties', () => {
    it('should compute isCreator as true when currentUserId matches createdById', () => {
      // Assert
      expect(component.isCreator()).toBe(true);
    });

    it('should compute isCreator as false when currentUserId does not match createdById', () => {
      // Arrange
      fixture.componentRef.setInput('currentUserId_', 9);
      fixture.detectChanges();

      // Assert
      expect(component.isCreator()).toBe(false);
    });

    it('should compute isAssignee as false when currentUserId does not match assignedToId', () => {
      // Assert
      expect(component.isAssignee()).toBe(false);
    });

    it('should compute isAssignee as true when currentUserId matches assignedToId', () => {
      // Arrange
      fixture.componentRef.setInput('currentUserId_', 1);
      fixture.detectChanges();

      // Assert
      expect(component.isAssignee()).toBe(true);
    });

    it('should compute availableStatuses from service', () => {
      // Assert
      expect(component.availableStatuses()).toEqual(['todo', 'in_progress', 'done']);
    });
  });

  describe('getPriorityLabel', () => {
    it('should call getPriorityLabel on service', () => {
      // Act
      const result = component.getPriorityLabel('high');

      // Assert
      expect(taskUiServiceGetPriorityLabelMock).toHaveBeenCalledWith('high');
      expect(result).toBe('priority_high');
    });
  });

  describe('getPrioritySeverity', () => {
    it('should call getPrioritySeverity on service', () => {
      // Act
      const result = component.getPrioritySeverity('low');

      // Assert
      expect(taskUiServiceGetPrioritySeverityMock).toHaveBeenCalledWith('low');
      expect(result).toBe('info');
    });
  });

  describe('getStatusLabel', () => {
    it('should call getStatusLabel on service', () => {
      // Act
      const result = component.getStatusLabel('done');

      // Assert
      expect(taskUiServiceGetStatusLabelMock).toHaveBeenCalledWith('done');
      expect(result).toBe('status_done');
    });
  });

  describe('getStatusSeverity', () => {
    it('should call getStatusSeverity on service', () => {
      // Act
      const result = component.getStatusSeverity('todo');

      // Assert
      expect(taskUiServiceGetStatusSeverityMock).toHaveBeenCalledWith('todo');
      expect(result).toBe('secondary');
    });
  });

  describe('onEdit', () => {
    it('should emit edit event when user is creator', () => {
      // Act
      component.onEdit();

      // Assert
      expect(taskUiEventsEditMock).toHaveBeenCalledWith(mockTask);
    });

    it('should not emit edit event when user is not creator', () => {
      // Arrange
      fixture.componentRef.setInput('currentUserId_', 9);
      fixture.detectChanges();

      // Act
      component.onEdit();

      // Assert
      expect(taskUiEventsEditMock).not.toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should emit delete event with task id when user is creator', () => {
      // Act
      component.onDelete();

      // Assert
      expect(taskUiEventsDeleteMock).toHaveBeenCalledWith(mockTask.id);
    });

    it('should not emit delete event when user is not creator', () => {
      // Arrange
      fixture.componentRef.setInput('currentUserId_', 9);
      fixture.detectChanges();

      // Act
      component.onDelete();

      // Assert
      expect(taskUiEventsDeleteMock).not.toHaveBeenCalled();
    });
  });

  describe('onStatusChange', () => {
    it('should emit statusChange event with task id and new status', () => {
      // Arrange
      const newStatus = 'in_progress';

      // Act
      component.onStatusChange(newStatus);

      // Assert
      expect(taskUiEventsChangeStatusMock).toHaveBeenCalledWith(mockTask.id, newStatus);
    });
  });
});
