import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { MockInstance, MockProvider } from 'ng-mocks';

import { TaskApiService } from './task-api.service';
import { API_ENDPOINTS } from '@core/api/config/constants/api-endpoints.constants';
import { TaskListResponse, TaskResponse, NewTaskRequest } from '@core/api/models/task/task-api.model';
import { Task } from '@feature/tasks/model/tasks.model';

describe('TaskApiService', () => {
  MockInstance.scope();

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

  const mockTaskResponse: TaskResponse = {
    data: mockTask,
    success: true,
  };

  const mockTaskListResponse: TaskListResponse = {
    data: [mockTask],
    success: true,
    count: 1,
  };

  let service: TaskApiService;
  let httpGetMock: jest.Mock;
  let httpPostMock: jest.Mock;
  let httpPutMock: jest.Mock;
  let httpPatchMock: jest.Mock;
  let httpDeleteMock: jest.Mock;

  beforeEach(() => {
    httpGetMock = jest.fn().mockReturnValue(of(mockTaskListResponse));
    httpPostMock = jest.fn().mockReturnValue(of(mockTaskResponse));
    httpPutMock = jest.fn().mockReturnValue(of(mockTaskResponse));
    httpPatchMock = jest.fn().mockReturnValue(of(mockTaskResponse));
    httpDeleteMock = jest.fn().mockReturnValue(of({ success: true, message: 'Task deleted' }));

    MockInstance(HttpClient, () => ({
      get: httpGetMock,
      post: httpPostMock,
      put: httpPutMock,
      patch: httpPatchMock,
      delete: httpDeleteMock,
    }));

    TestBed.configureTestingModule({
      providers: [MockProvider(HttpClient), TaskApiService],
    });

    service = TestBed.inject(TaskApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should call correct endpoint and return task list', () => {
      // Act
      service.getTasks();

      // Assert
      expect(httpGetMock).toHaveBeenCalledWith(API_ENDPOINTS.TASKS.BASE);
    });
  });

  describe('getTaskById', () => {
    it('should call correct endpoint with task id and return task', () => {
      // Arrange
      const taskId = 42;

      // Act
      service.getTaskById(taskId);

      // Assert
      expect(httpGetMock).toHaveBeenCalledWith(API_ENDPOINTS.TASKS.BY_ID(taskId));
    });
  });

  describe('createTask', () => {
    it('should call correct endpoint with payload and return created task', () => {
      // Arrange
      const newTaskRequest: NewTaskRequest = {
        title: 'New Task',
        status: 'todo',
        priority: 'high',
        assignedToId: 1,
      };

      // Act
      service.createTask(newTaskRequest);

      // Assert
      expect(httpPostMock).toHaveBeenCalledWith(API_ENDPOINTS.TASKS.BASE, newTaskRequest);
    });
  });

  describe('updateTask', () => {
    it('should call correct endpoint with task id and payload and return updated task', () => {
      // Arrange
      const taskId = 42;
      const updateData: Partial<Task> = {
        title: 'Updated Task',
      };

      // Act
      service.updateTask(taskId, updateData);

      // Assert
      expect(httpPutMock).toHaveBeenCalledWith(API_ENDPOINTS.TASKS.BY_ID(taskId), updateData);
    });
  });

  describe('updateTaskStatus', () => {
    it('should call correct endpoint with task id and status', () => {
      // Arrange
      const taskId = 42;
      const status = 'in_progress' as const;

      // Act
      service.updateTaskStatus(taskId, status);

      // Assert
      expect(httpPatchMock).toHaveBeenCalledWith(API_ENDPOINTS.TASKS.STATUS(taskId), { status });
    });
  });

  describe('deleteTask', () => {
    it('should call correct endpoint with task id and return success response', () => {
      // Arrange
      const taskId = 42;

      // Act
      service.deleteTask(taskId);

      // Assert
      expect(httpDeleteMock).toHaveBeenCalledWith(API_ENDPOINTS.TASKS.BY_ID(taskId));
    });
  });
});
