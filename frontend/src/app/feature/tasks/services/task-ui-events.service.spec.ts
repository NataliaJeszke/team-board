import { TestBed } from '@angular/core/testing';

import { TaskUiEventsService } from './task-ui-events.service';
import { Task } from '@feature/tasks/model/tasks.model';

describe('TaskUiEventsService', () => {
  let service: TaskUiEventsService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskUiEventsService],
    });

    service = TestBed.inject(TaskUiEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('edit', () => {
    it('should emit edit event with task', (done) => {
      // Arrange
      service.uiEvents$.subscribe(event => {
        // Assert
        expect(event.type).toBe('edit');
        expect(event).toEqual({ type: 'edit', task: mockTask });
        done();
      });

      // Act
      service.edit(mockTask);
    });
  });

  describe('delete', () => {
    it('should emit delete event with taskId', (done) => {
      // Arrange
      const taskId = 42;

      service.uiEvents$.subscribe(event => {
        // Assert
        expect(event.type).toBe('delete');
        expect(event).toEqual({ type: 'delete', taskId });
        done();
      });

      // Act
      service.delete(taskId);
    });
  });

  describe('changeStatus', () => {
    it('should emit statusChange event with taskId and status', (done) => {
      // Arrange
      const taskId = 42;
      const status = 'in_progress' as const;

      service.uiEvents$.subscribe(event => {
        // Assert
        expect(event.type).toBe('statusChange');
        expect(event).toEqual({ type: 'statusChange', taskId, status });
        done();
      });

      // Act
      service.changeStatus(taskId, status);
    });
  });
});
