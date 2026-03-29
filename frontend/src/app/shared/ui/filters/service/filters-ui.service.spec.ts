import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MockInstance, MockProvider } from 'ng-mocks';

import { FiltersService } from './filters-ui.service';
import { FilterConfig, FilterOption } from '../model/filters.model';
import { FilterType } from '../constants/filters.constants';

describe('FiltersService', () => {
  MockInstance.scope();

  let service: FiltersService;
  let translateInstantMock: jest.Mock;

  const mockFilterConfig: FilterConfig[] = [
    {
      key: 'status',
      type: FilterType.SELECT,
      options: [
        { label: 'filter.status.todo', value: 'todo' },
        { label: 'filter.status.done', value: 'done' },
      ],
    },
    {
      key: 'priority',
      type: FilterType.SELECT,
      options: [
        { label: 'filter.priority.low', value: 'low' },
        { label: 'filter.priority.high', value: 'high' },
      ],
    },
    {
      key: 'startDate',
      type: FilterType.DATE,
    },
    {
      key: 'search',
      type: FilterType.TEXT,
      defaultValue: 'default search',
    },
  ];

  beforeEach(() => {
    translateInstantMock = jest.fn((key: string) => `translated_${key}`);

    MockInstance(TranslateService, () => ({
      instant: translateInstantMock,
    }));

    TestBed.configureTestingModule({
      providers: [MockProvider(TranslateService), FormBuilder, FiltersService],
    });

    service = TestBed.inject(FiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createFilterForm', () => {
    it('should create form with controls for each filter', () => {
      // Act
      const form = service.createFilterForm(mockFilterConfig);

      // Assert
      expect(form.get('status')).toBeTruthy();
      expect(form.get('priority')).toBeTruthy();
      expect(form.get('startDate')).toBeTruthy();
      expect(form.get('search')).toBeTruthy();
    });

    it('should set initial value to empty string for SELECT filters without defaultValue', () => {
      // Act
      const form = service.createFilterForm(mockFilterConfig);

      // Assert
      expect(form.get('status')?.value).toBe('');
      expect(form.get('priority')?.value).toBe('');
    });

    it('should set initial value to null for DATE filters', () => {
      // Act
      const form = service.createFilterForm(mockFilterConfig);

      // Assert
      expect(form.get('startDate')?.value).toBeNull();
    });

    it('should set initial value to defaultValue when provided', () => {
      // Act
      const form = service.createFilterForm(mockFilterConfig);

      // Assert
      expect(form.get('search')?.value).toBe('default search');
    });
  });

  describe('getFilterChanges', () => {
    it('should return observable of form value changes', done => {
      // Arrange
      const form = service.createFilterForm(mockFilterConfig);

      // Act
      service.getFilterChanges(form).subscribe(values => {
        // Assert
        expect(values).toEqual({
          status: 'todo',
          priority: '',
          startDate: null,
          search: 'default search',
        });
        done();
      });

      form.patchValue({ status: 'todo' });
    });

    it('should use distinctUntilChanged to avoid duplicate emissions', done => {
      // Arrange
      const form = service.createFilterForm(mockFilterConfig);
      let emissionCount = 0;

      // Act
      service.getFilterChanges(form).subscribe(() => {
        emissionCount++;
      });

      form.patchValue({ status: 'todo' });
      form.patchValue({ status: 'todo' });

      setTimeout(() => {
        // Assert
        expect(emissionCount).toBe(1);
        done();
      }, 100);
    });
  });

  describe('translateOptions', () => {
    it('should translate all option labels', () => {
      // Arrange
      const options: FilterOption[] = [
        { label: 'filter.status.todo', value: 'todo' },
        { label: 'filter.status.done', value: 'done' },
      ];

      // Act
      const result = service.translateOptions(options);

      // Assert
      expect(result).toEqual([
        { label: 'translated_filter.status.todo', value: 'todo' },
        { label: 'translated_filter.status.done', value: 'done' },
      ]);
      expect(translateInstantMock).toHaveBeenCalledTimes(2);
    });

    it('should preserve option values', () => {
      // Arrange
      const options: FilterOption[] = [
        { label: 'key1', value: 123 },
        { label: 'key2', value: 'stringValue' },
      ];

      // Act
      const result = service.translateOptions(options);

      // Assert
      expect(result[0].value).toBe(123);
      expect(result[1].value).toBe('stringValue');
    });
  });

  describe('translatePlaceholder', () => {
    it('should translate placeholder key', () => {
      // Act
      const result = service.translatePlaceholder('filter.placeholder.search');

      // Assert
      expect(translateInstantMock).toHaveBeenCalledWith('filter.placeholder.search');
      expect(result).toBe('translated_filter.placeholder.search');
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to their initial values', () => {
      // Arrange
      const form = service.createFilterForm(mockFilterConfig);
      form.patchValue({
        status: 'done',
        priority: 'high',
        startDate: '2025-01-01',
        search: 'modified search',
      });

      // Act
      service.resetFilters(form, mockFilterConfig);

      // Assert
      expect(form.get('status')?.value).toBe('');
      expect(form.get('priority')?.value).toBe('');
      expect(form.get('startDate')?.value).toBeNull();
      expect(form.get('search')?.value).toBe('default search');
    });
  });
});
