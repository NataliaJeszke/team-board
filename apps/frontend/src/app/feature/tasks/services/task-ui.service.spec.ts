import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MockInstance, MockProvider } from 'ng-mocks';

import { TaskUiService } from './task-ui.service';

describe('TaskUiService', () => {
  MockInstance.scope();

  let service: TaskUiService;
  let translateInstantMock: jest.Mock;

  beforeEach(() => {
    translateInstantMock = jest.fn((key: string) => key);

    MockInstance(TranslateService, () => ({
      instant: translateInstantMock,
    }));

    TestBed.configureTestingModule({
      providers: [MockProvider(TranslateService), TaskUiService],
    });

    service = TestBed.inject(TaskUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('availableStatuses', () => {
    it('should have correct available statuses', () => {
      // Assert
      expect(service.availableStatuses).toEqual(['todo', 'in_progress', 'done']);
    });
  });

  describe('getPriorityLabel', () => {
    it('should return translated label for low priority', () => {
      // Act
      const result = service.getPriorityLabel('low');

      // Assert
      expect(translateInstantMock).toHaveBeenCalledWith('common.components.task.priority.low');
      expect(result).toBe('common.components.task.priority.low');
    });

    it('should return translated label for medium priority', () => {
      // Act
      const result = service.getPriorityLabel('medium');

      // Assert
      expect(translateInstantMock).toHaveBeenCalledWith('common.components.task.priority.medium');
      expect(result).toBe('common.components.task.priority.medium');
    });

    it('should return translated label for high priority', () => {
      // Act
      const result = service.getPriorityLabel('high');

      // Assert
      expect(translateInstantMock).toHaveBeenCalledWith('common.components.task.priority.high');
      expect(result).toBe('common.components.task.priority.high');
    });
  });

  describe('getPrioritySeverity', () => {
    it('should return success severity for low priority', () => {
      // Act
      const result = service.getPrioritySeverity('low');

      // Assert
      expect(result).toBe('success');
    });

    it('should return info severity for medium priority', () => {
      // Act
      const result = service.getPrioritySeverity('medium');

      // Assert
      expect(result).toBe('info');
    });

    it('should return danger severity for high priority', () => {
      // Act
      const result = service.getPrioritySeverity('high');

      // Assert
      expect(result).toBe('danger');
    });
  });

  describe('getStatusLabel', () => {
    it('should return translated label for todo status', () => {
      // Act
      const result = service.getStatusLabel('todo');

      // Assert
      expect(translateInstantMock).toHaveBeenCalledWith('common.components.task.status.todo');
      expect(result).toBe('common.components.task.status.todo');
    });

    it('should return translated label for in_progress status', () => {
      // Act
      const result = service.getStatusLabel('in_progress');

      // Assert
      expect(translateInstantMock).toHaveBeenCalledWith('common.components.task.status.in_progress');
      expect(result).toBe('common.components.task.status.in_progress');
    });

    it('should return translated label for done status', () => {
      // Act
      const result = service.getStatusLabel('done');

      // Assert
      expect(translateInstantMock).toHaveBeenCalledWith('common.components.task.status.done');
      expect(result).toBe('common.components.task.status.done');
    });

    it('should return translated label for delayed status', () => {
      // Act
      const result = service.getStatusLabel('delayed');

      // Assert
      expect(translateInstantMock).toHaveBeenCalledWith('common.components.task.status.delayed');
      expect(result).toBe('common.components.task.status.delayed');
    });
  });

  describe('getStatusSeverity', () => {
    it('should return secondary severity for todo status', () => {
      // Act
      const result = service.getStatusSeverity('todo');

      // Assert
      expect(result).toBe('secondary');
    });

    it('should return info severity for in_progress status', () => {
      // Act
      const result = service.getStatusSeverity('in_progress');

      // Assert
      expect(result).toBe('info');
    });

    it('should return warn severity for delayed status', () => {
      // Act
      const result = service.getStatusSeverity('delayed');

      // Assert
      expect(result).toBe('warn');
    });

    it('should return success severity for done status', () => {
      // Act
      const result = service.getStatusSeverity('done');

      // Assert
      expect(result).toBe('success');
    });
  });

  describe('canEdit', () => {
    it('should return true when currentUserId matches createdById', () => {
      // Arrange
      const task = { createdById: 1 };
      const currentUserId = 1;

      // Act
      const result = service.canEdit(task, currentUserId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when currentUserId does not match createdById', () => {
      // Arrange
      const task = { createdById: 1 };
      const currentUserId = 2;

      // Act
      const result = service.canEdit(task, currentUserId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('canChangeStatus', () => {
    it('should return true when currentUserId matches createdById', () => {
      // Arrange
      const task = { createdById: 1, assignedToId: 2 };
      const currentUserId = 1;

      // Act
      const result = service.canChangeStatus(task, currentUserId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when currentUserId matches assignedToId', () => {
      // Arrange
      const task = { createdById: 1, assignedToId: 2 };
      const currentUserId = 2;

      // Act
      const result = service.canChangeStatus(task, currentUserId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when currentUserId matches neither createdById nor assignedToId', () => {
      // Arrange
      const task = { createdById: 1, assignedToId: 2 };
      const currentUserId = 3;

      // Act
      const result = service.canChangeStatus(task, currentUserId);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when currentUserId is both creator and assignee', () => {
      // Arrange
      const task = { createdById: 1, assignedToId: 1 };
      const currentUserId = 1;

      // Act
      const result = service.canChangeStatus(task, currentUserId);

      // Assert
      expect(result).toBe(true);
    });
  });
});
