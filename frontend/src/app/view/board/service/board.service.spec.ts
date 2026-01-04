import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MockInstance, MockProvider } from 'ng-mocks';
import { of, Subject } from 'rxjs';

import { BoardService } from './board.service';
import { TasksFacade } from '@feature/tasks/tasks.facade';
import { UsersDictionaryFacade } from '@feature/users-dictionary/users-dictionary.facade';
import { TasksFiltersService } from '@feature/tasks/filters/service/tasks-filters.service';
import { TaskUiEventsService, TaskUiEvent } from '@common/components/task/service/task-ui-events.service';
import { FilterType } from '@common/components/filters/constants/filters.constants';
import { FilterConfig } from '@common/components/filters/model/filters.model';
import { User } from '@core/models';
import { Task } from '@feature/tasks/model/tasks.model';

describe('BoardService', () => {
  MockInstance.scope();

  let service: BoardService;
  let translateInstantMock: jest.Mock;
  let dialogServiceOpenMock: jest.Mock;
  let taskUiEventsSubject: Subject<TaskUiEvent>;
  let filtersServiceBuildConfigMock: jest.Mock;
  let tasksFacadeLoadTasksMock: jest.Mock;
  let tasksFacadeCreateTaskMock: jest.Mock;
  let tasksFacadeUpdateTaskMock: jest.Mock;
  let tasksFacadeDeleteTaskMock: jest.Mock;
  let tasksFacadeChangeTaskStatusMock: jest.Mock;
  let tasksFacadeSetFiltersMock: jest.Mock;
  let tasksFacadeClearFiltersMock: jest.Mock;
  let tasksFacadeGetTaskByIdMock: jest.Mock;
  let usersDictionaryFacadeLoadUsersDictionaryMock: jest.Mock;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

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

  const mockUsersDictionary = {
    1: { id: 1, name: 'User One' },
    2: { id: 2, name: 'User Two' },
  };

  beforeEach(() => {
    translateInstantMock = jest.fn((key: string) => key);
    dialogServiceOpenMock = jest.fn().mockReturnValue({
      onClose: of({ action: 'cancel' }),
    });
    taskUiEventsSubject = new Subject();
    filtersServiceBuildConfigMock = jest.fn().mockReturnValue([]);
    tasksFacadeLoadTasksMock = jest.fn();
    tasksFacadeCreateTaskMock = jest.fn();
    tasksFacadeUpdateTaskMock = jest.fn();
    tasksFacadeDeleteTaskMock = jest.fn();
    tasksFacadeChangeTaskStatusMock = jest.fn();
    tasksFacadeSetFiltersMock = jest.fn();
    tasksFacadeClearFiltersMock = jest.fn();
    tasksFacadeGetTaskByIdMock = jest.fn().mockReturnValue(of(mockTask));
    usersDictionaryFacadeLoadUsersDictionaryMock = jest.fn();

    MockInstance(TranslateService, () => ({
      instant: translateInstantMock,
    }));

    MockInstance(DialogService, () => ({
      open: dialogServiceOpenMock,
    }));

    MockInstance(TaskUiEventsService, () => ({
      uiEvents$: taskUiEventsSubject.asObservable(),
    }));

    MockInstance(TasksFiltersService, () => ({
      buildConfig: filtersServiceBuildConfigMock,
    }));

    MockInstance(TasksFacade, () => ({
      loadTasks: tasksFacadeLoadTasksMock,
      createTask: tasksFacadeCreateTaskMock,
      updateTask: tasksFacadeUpdateTaskMock,
      deleteTask: tasksFacadeDeleteTaskMock,
      changeTaskStatus: tasksFacadeChangeTaskStatusMock,
      setFilters: tasksFacadeSetFiltersMock,
      clearFilters: tasksFacadeClearFiltersMock,
      getTaskById: tasksFacadeGetTaskByIdMock,
    }));

    MockInstance(UsersDictionaryFacade, () => ({
      dictionary: signal(mockUsersDictionary),
      loadUsersDictionary: usersDictionaryFacadeLoadUsersDictionaryMock,
    }));

    TestBed.configureTestingModule({
      providers: [
        MockProvider(TranslateService),
        MockProvider(DialogService),
        MockProvider(TaskUiEventsService),
        MockProvider(TasksFiltersService),
        MockProvider(TasksFacade),
        MockProvider(UsersDictionaryFacade),
        BoardService,
      ],
    });

    service = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFiltersConfig', () => {
    it('should build filters config with available users from dictionary', () => {
      // Act
      service.getFiltersConfig();

      // Assert
      expect(filtersServiceBuildConfigMock).toHaveBeenCalledWith(Object.values(mockUsersDictionary));
    });

    it('should return filters config', () => {
      // Arrange
      const mockConfig: FilterConfig[] = [{ key: 'status', type: FilterType.SELECT }];
      filtersServiceBuildConfigMock.mockReturnValue(mockConfig);

      // Act
      const result = service.getFiltersConfig();

      // Assert
      expect(result).toEqual(mockConfig);
    });
  });

  describe('handleAddTaskDialog', () => {
    it('should return EMPTY when currentUser is null', (done) => {
      // Act
      service.handleAddTaskDialog(null).subscribe({
        next: () => {
          fail('Should not emit');
        },
        complete: () => {
          done();
        },
      });
    });

    it('should open task dialog with correct parameters', (done) => {
      // Arrange
      dialogServiceOpenMock.mockReturnValue({
        onClose: of({ action: 'save', formValue: { title: 'Test', assignedToId: 1, priority: 'medium', status: 'todo' } }),
      });

      // Act
      service.handleAddTaskDialog(mockUser).subscribe(() => {
        // Assert
        expect(dialogServiceOpenMock).toHaveBeenCalled();
        done();
      });
    });

    it('should create task when dialog returns save action', (done) => {
      // Arrange
      const formValue = {
        title: 'New Task',
        assignedToId: 1,
        priority: 'high' as const,
        status: 'todo' as const,
      };

      dialogServiceOpenMock.mockReturnValue({
        onClose: of({ action: 'save', formValue }),
      });

      // Act
      service.handleAddTaskDialog(mockUser).subscribe(() => {
        // Assert
        expect(tasksFacadeCreateTaskMock).toHaveBeenCalledWith(formValue);
        done();
      });
    });

    it('should return success result when task is created', (done) => {
      // Arrange
      const formValue = {
        title: 'New Task',
        assignedToId: 1,
        priority: 'high' as const,
        status: 'todo' as const,
      };

      dialogServiceOpenMock.mockReturnValue({
        onClose: of({ action: 'save', formValue }),
      });

      // Act
      service.handleAddTaskDialog(mockUser).subscribe(result => {
        // Assert
        expect(result.success).toBe(true);
        expect(result.severity).toBe('success');
        done();
      });
    });
  });

  describe('handleEditTaskEvents', () => {
    it('should return EMPTY when currentUser is null', (done) => {
      // Arrange
      service.handleEditTaskEvents(null).subscribe({
        next: () => {
          fail('Should not emit');
        },
        complete: () => {
          done();
        },
      });

      // Act
      taskUiEventsSubject.next({ type: 'edit', task: mockTask });
      taskUiEventsSubject.complete();
    });

    it('should open edit dialog when edit event is emitted', (done) => {
      // Arrange
      dialogServiceOpenMock.mockReturnValue({
        onClose: of({ action: 'save', taskId: 1, formValue: {} }),
      });

      service.handleEditTaskEvents(mockUser).subscribe(() => {
        // Assert
        expect(dialogServiceOpenMock).toHaveBeenCalled();
        done();
      });

      // Act
      taskUiEventsSubject.next({ type: 'edit', task: mockTask });
    });

    it('should update task when dialog returns save action', (done) => {
      // Arrange
      const formValue = {
        title: 'Updated Task',
        assignedToId: 1,
        priority: 'high' as const,
        status: 'in_progress' as const,
      };

      dialogServiceOpenMock.mockReturnValue({
        onClose: of({ action: 'save', taskId: 1, formValue }),
      });

      service.handleEditTaskEvents(mockUser).subscribe(() => {
        // Assert
        expect(tasksFacadeUpdateTaskMock).toHaveBeenCalledWith(1, formValue);
        done();
      });

      // Act
      taskUiEventsSubject.next({ type: 'edit', task: mockTask });
    });
  });

  describe('handleStatusChangeEvents', () => {
    it('should return EMPTY when currentUser is null', (done) => {
      // Arrange
      service.handleStatusChangeEvents(null).subscribe({
        next: () => {
          fail('Should not emit');
        },
        complete: () => {
          done();
        },
      });

      // Act
      taskUiEventsSubject.next({ type: 'statusChange', taskId: 1, status: 'done' });
      taskUiEventsSubject.complete();
    });

    it('should change task status when statusChange event is emitted', (done) => {
      // Arrange
      service.handleStatusChangeEvents(mockUser).subscribe(() => {
        // Assert
        expect(tasksFacadeChangeTaskStatusMock).toHaveBeenCalledWith(1, 'done');
        done();
      });

      // Act
      taskUiEventsSubject.next({ type: 'statusChange', taskId: 1, status: 'done' });
    });

    it('should return success result when status is changed', (done) => {
      // Arrange
      service.handleStatusChangeEvents(mockUser).subscribe(result => {
        // Assert
        expect(result.success).toBe(true);
        expect(result.severity).toBe('success');
        done();
      });

      // Act
      taskUiEventsSubject.next({ type: 'statusChange', taskId: 1, status: 'done' });
    });
  });

  describe('handleDeleteTaskEvents', () => {
    it('should get task by id when delete event is emitted', (done) => {
      // Arrange
      dialogServiceOpenMock.mockReturnValue({
        onClose: of(false),
      });

      service.handleDeleteTaskEvents().subscribe({
        complete: () => {
          // Assert
          expect(tasksFacadeGetTaskByIdMock).toHaveBeenCalledWith(1);
          done();
        },
      });

      // Act
      taskUiEventsSubject.next({ type: 'delete', taskId: 1 });
      taskUiEventsSubject.complete();
    });

    it('should open confirm dialog with task data', (done) => {
      // Arrange
      dialogServiceOpenMock.mockReturnValue({
        onClose: of(false),
      });

      service.handleDeleteTaskEvents().subscribe({
        complete: () => {
          // Assert
          expect(dialogServiceOpenMock).toHaveBeenCalled();
          done();
        },
      });

      // Act
      taskUiEventsSubject.next({ type: 'delete', taskId: 1 });
      taskUiEventsSubject.complete();
    });

    it('should delete task when user confirms deletion', (done) => {
      // Arrange
      dialogServiceOpenMock.mockReturnValue({
        onClose: of(true),
      });

      service.handleDeleteTaskEvents().subscribe(() => {
        // Assert
        expect(tasksFacadeDeleteTaskMock).toHaveBeenCalledWith(1);
        done();
      });

      // Act
      taskUiEventsSubject.next({ type: 'delete', taskId: 1 });
    });

    it('should not delete task when user cancels deletion', (done) => {
      // Arrange
      dialogServiceOpenMock.mockReturnValue({
        onClose: of(false),
      });

      service.handleDeleteTaskEvents().subscribe({
        next: () => {
          fail('Should not emit');
        },
        complete: () => {
          // Assert
          expect(tasksFacadeDeleteTaskMock).not.toHaveBeenCalled();
          done();
        },
      });

      // Act
      taskUiEventsSubject.next({ type: 'delete', taskId: 1 });
      taskUiEventsSubject.complete();
    });
  });

  describe('applyFilters', () => {
    it('should call setFilters with filter values', () => {
      // Arrange
      const filters = { status: 'todo' as const, priority: 'high' as const };

      // Act
      service.applyFilters(filters);

      // Assert
      expect(tasksFacadeSetFiltersMock).toHaveBeenCalledWith(filters);
    });
  });

  describe('resetFilters', () => {
    it('should call clearFilters on facade', () => {
      // Act
      service.resetFilters();

      // Assert
      expect(tasksFacadeClearFiltersMock).toHaveBeenCalled();
    });
  });

  describe('initializeData', () => {
    it('should load tasks and users dictionary', () => {
      // Act
      service.initializeData();

      // Assert
      expect(tasksFacadeLoadTasksMock).toHaveBeenCalled();
      expect(usersDictionaryFacadeLoadUsersDictionaryMock).toHaveBeenCalled();
    });
  });
});
