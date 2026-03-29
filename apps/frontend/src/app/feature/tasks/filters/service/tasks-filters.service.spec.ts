import { TestBed } from '@angular/core/testing';

import { TasksFiltersService } from './tasks-filters.service';
import { UserForFilters } from '../model/tasks-filters.model';
import { TASK_FILTERS_CONFIG } from '../constants/tasks-filters.constants';

describe('TasksFiltersService', () => {
  let service: TasksFiltersService;

  const mockUsers: UserForFilters[] = [
    { id: 1, name: 'User One' },
    { id: 2, name: 'User Two' },
    { id: 3, name: 'User Three' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksFiltersService],
    });

    service = TestBed.inject(TasksFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildConfig', () => {
    it('should return filter config with user options for authorId filter', () => {
      // Act
      const result = service.buildConfig(mockUsers);

      // Assert
      const authorFilter = result.find(filter => filter.key === 'authorId');
      expect(authorFilter).toBeDefined();
      expect(authorFilter!.options).toEqual([
        { label: 'User One', value: 1 },
        { label: 'User Two', value: 2 },
        { label: 'User Three', value: 3 },
      ]);
    });

    it('should return filter config with user options for assigneeId filter', () => {
      // Act
      const result = service.buildConfig(mockUsers);

      // Assert
      const assigneeFilter = result.find(filter => filter.key === 'assigneeId');
      expect(assigneeFilter).toBeDefined();
      expect(assigneeFilter!.options).toEqual([
        { label: 'User One', value: 1 },
        { label: 'User Two', value: 2 },
        { label: 'User Three', value: 3 },
      ]);
    });

    it('should return same number of filters as TASK_FILTERS_CONFIG', () => {
      // Act
      const result = service.buildConfig(mockUsers);

      // Assert
      expect(result.length).toBe(TASK_FILTERS_CONFIG.length);
    });

    it('should preserve original filter config for non-user filters', () => {
      // Act
      const result = service.buildConfig(mockUsers);

      // Assert
      const nonUserFilters = result.filter(filter => filter.key !== 'authorId' && filter.key !== 'assigneeId');
      const originalNonUserFilters = TASK_FILTERS_CONFIG.filter(
        filter => filter.key !== 'authorId' && filter.key !== 'assigneeId'
      );

      expect(nonUserFilters.length).toBe(originalNonUserFilters.length);
    });

    it('should handle empty user array', () => {
      // Act
      const result = service.buildConfig([]);

      // Assert
      const authorFilter = result.find(filter => filter.key === 'authorId');
      expect(authorFilter!.options).toEqual([]);
    });

    it('should create correct options from users with different names', () => {
      // Arrange
      const customUsers: UserForFilters[] = [
        { id: 100, name: 'Alice' },
        { id: 200, name: 'Bob' },
      ];

      // Act
      const result = service.buildConfig(customUsers);

      // Assert
      const authorFilter = result.find(filter => filter.key === 'authorId');
      expect(authorFilter!.options).toEqual([
        { label: 'Alice', value: 100 },
        { label: 'Bob', value: 200 },
      ]);
    });
  });
});
