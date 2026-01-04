import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { MockBuilder, MockInstance, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

import { FiltersComponent } from './filters.component';
import { FiltersService } from './service/filters-ui.service';
import { FilterConfig, FilterOption } from './model/filters.model';
import { FilterType } from './constants/filters.constants';

describe('FiltersComponent', () => {
  MockInstance.scope();

  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let filtersServiceCreateFilterFormMock: jest.Mock;
  let filtersServiceGetFilterChangesMock: jest.Mock;
  let filtersServiceTranslateOptionsMock: jest.Mock;
  let filtersServiceTranslatePlaceholderMock: jest.Mock;
  let filtersServiceResetFiltersMock: jest.Mock;

  const mockFilterConfig: FilterConfig[] = [
    {
      key: 'status',
      type: FilterType.SELECT,
      options: [
        { label: 'filter.status.todo', value: 'todo' },
        { label: 'filter.status.done', value: 'done' },
      ],
      placeholder: 'filter.placeholder.status',
    },
    {
      key: 'priority',
      type: FilterType.SELECT,
      options: [
        { label: 'filter.priority.low', value: 'low' },
        { label: 'filter.priority.high', value: 'high' },
      ],
    },
  ];

  const mockForm = new FormGroup({
    status: new FormControl(''),
    priority: new FormControl(''),
  });

  beforeEach(async () => {
    filtersServiceCreateFilterFormMock = jest.fn().mockReturnValue(mockForm);
    filtersServiceGetFilterChangesMock = jest.fn().mockReturnValue(of({}));
    filtersServiceTranslateOptionsMock = jest.fn((options: FilterOption[]) =>
      options.map(opt => ({ ...opt, label: `translated_${opt.label}` }))
    );
    filtersServiceTranslatePlaceholderMock = jest.fn((key: string) => `translated_${key}`);
    filtersServiceResetFiltersMock = jest.fn();

    MockInstance(FiltersService, () => ({
      createFilterForm: filtersServiceCreateFilterFormMock,
      getFilterChanges: filtersServiceGetFilterChangesMock,
      translateOptions: filtersServiceTranslateOptionsMock,
      translatePlaceholder: filtersServiceTranslatePlaceholderMock,
      resetFilters: filtersServiceResetFiltersMock,
    }));

    return MockBuilder(FiltersComponent).provide(MockProvider(FiltersService));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('config', mockFilterConfig);

    fixture.detectChanges();
    TestBed.flushEffects();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('component inputs', () => {
    it('should accept config input', () => {
      // Assert
      expect(component.config()).toEqual(mockFilterConfig);
    });
  });

  describe('getSelectOptions', () => {
    it('should translate filter options', () => {
      // Arrange
      const filter = mockFilterConfig[0];

      // Act
      const result = component.getSelectOptions(filter);

      // Assert
      expect(filtersServiceTranslateOptionsMock).toHaveBeenCalledWith(filter.options);
      expect(result[0].label).toContain('translated_');
    });

    it('should return empty array when filter has no options', () => {
      // Arrange
      const filter: FilterConfig = {
        key: 'search',
        type: FilterType.TEXT,
      };

      // Act
      const result = component.getSelectOptions(filter);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getPlaceholder', () => {
    it('should translate placeholder', () => {
      // Arrange
      const placeholder = 'filter.placeholder.search';

      // Act
      const result = component.getPlaceholder(placeholder);

      // Assert
      expect(filtersServiceTranslatePlaceholderMock).toHaveBeenCalledWith(placeholder);
      expect(result).toBe('translated_filter.placeholder.search');
    });

    it('should return empty string when placeholder is undefined', () => {
      // Act
      const result = component.getPlaceholder(undefined);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('resetFilters', () => {
    it('should call resetFilters on service with form and config', () => {
      // Act
      component.resetFilters();

      // Assert
      expect(filtersServiceResetFiltersMock).toHaveBeenCalledWith(mockForm, mockFilterConfig);
    });

    it('should not call resetFilters when form is null', () => {
      // Arrange
      component.filterForm.set(null);

      // Act
      component.resetFilters();

      // Assert
      expect(filtersServiceResetFiltersMock).not.toHaveBeenCalled();
    });
  });

  describe('form initialization', () => {
    it('should create filter form when config is provided', () => {
      // Assert
      expect(filtersServiceCreateFilterFormMock).toHaveBeenCalledWith(mockFilterConfig);
      expect(component.filterForm()).toBeTruthy();
    });

    it('should subscribe to form changes', () => {
      // Assert
      expect(filtersServiceGetFilterChangesMock).toHaveBeenCalledWith(mockForm);
    });

    it('should emit filtersChanged when form values change', done => {
      // Arrange
      const mockValues = { status: 'todo', priority: 'high' };
      filtersServiceGetFilterChangesMock.mockReturnValue(of(mockValues));

      const newFixture = TestBed.createComponent(FiltersComponent);
      const newComponent = newFixture.componentInstance;

      newComponent.filtersChanged.subscribe(values => {
        // Assert
        expect(values).toEqual(mockValues);
        done();
      });

      // Act
      newFixture.componentRef.setInput('config', mockFilterConfig);
      newFixture.detectChanges();
      TestBed.flushEffects();
    });
  });
});
