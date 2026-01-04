import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { User } from '@core/models';
import { AuthFacade } from '@core/auth/auth.facade';

import { TasksFacade } from '@feature/tasks/tasks.facade';
import { UsersDictionaryFacade } from '@feature/users-dictionary/users-dictionary.facade';

import { FilterValues } from '@common/components/filters/model/filters.model';

import { BoardComponent } from './board.component';
import { BoardService } from './service/board.service';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockAuthFacade: {
    user: ReturnType<typeof signal<User | null>>;
  };
  let mockTasksFacade: {
    error: ReturnType<typeof signal<string | null>>;
    warning: ReturnType<typeof signal<string | null>>;
    count: ReturnType<typeof signal<number>>;
    filteredTasks: ReturnType<typeof signal<Task[]>>;
    loadTasks: jest.Mock;
    setFilters: jest.Mock;
    clearFilters: jest.Mock;
    getTaskById: jest.Mock;
    createTask: jest.Mock;
    updateTask: jest.Mock;
    changeTaskStatus: jest.Mock;
    deleteTask: jest.Mock;
  };
  let mockUsersDictionaryFacade: {
    dictionary: ReturnType<typeof signal<Record<number, User>>>;
    loadUsersDictionary: jest.Mock;
  };
  let mockBoardService: {
    getFiltersConfig: jest.Mock;
    initializeData: jest.Mock;
    handleAddTaskDialog: jest.Mock;
    handleEditTaskEvents: jest.Mock;
    handleStatusChangeEvents: jest.Mock;
    handleDeleteTaskEvents: jest.Mock;
    applyFilters: jest.Mock;
    resetFilters: jest.Mock;
  };
  let messageService: MessageService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    mockAuthFacade = {
      user: signal<User | null>(mockUser),
    };

    mockTasksFacade = {
      error: signal<string | null>(null),
      warning: signal<string | null>(null),
      count: signal<number>(0),
      filteredTasks: signal<Task[]>([]),
      loadTasks: jest.fn(),
      setFilters: jest.fn(),
      clearFilters: jest.fn(),
      getTaskById: jest.fn().mockReturnValue(of(null)),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      changeTaskStatus: jest.fn(),
      deleteTask: jest.fn(),
    };

    mockUsersDictionaryFacade = {
      dictionary: signal<Record<number, User>>({}),
      loadUsersDictionary: jest.fn(),
    };

    mockBoardService = {
      getFiltersConfig: jest.fn().mockReturnValue([]),
      initializeData: jest.fn(),
      handleAddTaskDialog: jest.fn().mockReturnValue(of({ severity: 'success', summary: 'Task created' })),
      handleEditTaskEvents: jest.fn().mockReturnValue(of({ severity: 'success', summary: 'Task updated' })),
      handleStatusChangeEvents: jest.fn().mockReturnValue(of({ severity: 'success', summary: 'Status changed' })),
      handleDeleteTaskEvents: jest.fn().mockReturnValue(of({ severity: 'success', summary: 'Task deleted' })),
      applyFilters: jest.fn(),
      resetFilters: jest.fn(),
    };

    messageService = new MessageService();

    await TestBed.configureTestingModule({
      imports: [
        BoardComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
      providers: [
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: TasksFacade, useValue: mockTasksFacade },
        { provide: UsersDictionaryFacade, useValue: mockUsersDictionaryFacade },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BoardComponent, {
        set: {
          providers: [
            { provide: BoardService, useValue: mockBoardService },
            { provide: MessageService, useValue: messageService },
            { provide: DialogService, useValue: {} },
          ],
        },
      })
      .compileComponents();

    jest.spyOn(messageService, 'add');

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize data on ngOnInit', () => {
      component.ngOnInit();

      expect(mockBoardService.initializeData).toHaveBeenCalled();
    });

    it('should subscribe to UI task events on ngOnInit', () => {
      component.ngOnInit();

      expect(mockBoardService.handleEditTaskEvents).toHaveBeenCalledWith(mockUser);
      expect(mockBoardService.handleStatusChangeEvents).toHaveBeenCalledWith(mockUser);
      expect(mockBoardService.handleDeleteTaskEvents).toHaveBeenCalled();
    });
  });

  describe('Computed values', () => {
    it('should compute taskFiltersConfig', () => {
      const mockConfig = [{ key: 'status', type: 'select' as const, options: [] }];
      mockBoardService.getFiltersConfig.mockReturnValue(mockConfig);

      component.taskFiltersConfig();

      expect(mockBoardService.getFiltersConfig).toHaveBeenCalled();
    });
  });


  describe('onAddTask()', () => {
    it('should call boardService.handleAddTaskDialog with current user', () => {
      component.onAddTask();

      expect(mockBoardService.handleAddTaskDialog).toHaveBeenCalledWith(mockUser);
    });

    it('should display message from boardService result', () => {
      const mockResult = { severity: 'success' as const, summary: 'Task created', detail: 'Success' };
      mockBoardService.handleAddTaskDialog.mockReturnValue(of(mockResult));

      component.onAddTask();

      expect(messageService.add).toHaveBeenCalledWith(mockResult);
    });

    it('should handle user being null', () => {
      mockAuthFacade.user.set(null);

      component.onAddTask();

      expect(mockBoardService.handleAddTaskDialog).toHaveBeenCalledWith(null);
    });
  });

  describe('onFiltersChanged()', () => {
    it('should call boardService.applyFilters with filter values', () => {
      const filters: FilterValues = {
        status: 'active',
        priority: 'high',
      };

      component.onFiltersChanged(filters);

      expect(mockBoardService.applyFilters).toHaveBeenCalledWith(filters);
    });

    it('should apply empty filters', () => {
      const filters: FilterValues = {};

      component.onFiltersChanged(filters);

      expect(mockBoardService.applyFilters).toHaveBeenCalledWith(filters);
    });

    it('should apply multiple filter values', () => {
      const filters: FilterValues = {
        status: 'completed',
        assignee: '1',
        priority: 'low',
        search: 'test',
      };

      component.onFiltersChanged(filters);

      expect(mockBoardService.applyFilters).toHaveBeenCalledWith(filters);
    });
  });

  describe('onFiltersReset()', () => {
    it('should call boardService.resetFilters', () => {
      component.onFiltersReset();

      expect(mockBoardService.resetFilters).toHaveBeenCalled();
    });

    it('should call resetFilters only once', () => {
      component.onFiltersReset();

      expect(mockBoardService.resetFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Facade integration', () => {
    it('should expose currentUser from authFacade', () => {
      expect(component.currentUser).toBe(mockAuthFacade.user);
    });

    it('should expose usersDictionary from usersDictionaryFacade', () => {
      expect(component.usersDictionary).toBe(mockUsersDictionaryFacade.dictionary);
    });

    it('should update currentUser when authFacade.user changes', () => {
      const newUser: User = {
        id: 2,
        name: 'New User',
        email: 'new@example.com',
      };

      mockAuthFacade.user.set(newUser);

      expect(component.currentUser()).toEqual(newUser);
    });
  });

  describe('Edge cases', () => {
    it('should handle calling onAddTask multiple times', () => {
      component.onAddTask();
      component.onAddTask();
      component.onAddTask();

      expect(mockBoardService.handleAddTaskDialog).toHaveBeenCalledTimes(3);
    });

    it('should handle calling onFiltersReset multiple times', () => {
      component.onFiltersReset();
      component.onFiltersReset();

      expect(mockBoardService.resetFilters).toHaveBeenCalledTimes(2);
    });
  });
});
