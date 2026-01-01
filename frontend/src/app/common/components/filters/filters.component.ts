import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { FilterConfig, FilterOption, FilterValues } from './model/filters.model';
import { FiltersService } from './service/filters-ui.service';

@Component({
  selector: 'tb-filters',
  standalone: true,
  imports: [
    CardModule,
    SelectModule,
    ButtonModule,
    CommonModule,
    TranslateModule,
    DatePickerModule,
    ReactiveFormsModule,
  ],
  providers: [FiltersService],
  templateUrl: './filters.component.html',
})
export class FiltersComponent {
  readonly config = input.required<readonly FilterConfig[]>();
  readonly filtersChanged = output<FilterValues>();

  private readonly filtersService = inject(FiltersService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filterForm = signal<FormGroup | null>(null);

  constructor() {
    this.initializeForm();
    this.setupFormSubscription();
  }

  getSelectOptions(filter: FilterConfig): FilterOption[] {
    if (!filter.options) return [];
    return this.filtersService.translateOptions(filter.options);
  }

  getPlaceholder(placeholder?: string): string {
    if (!placeholder) return '';
    return this.filtersService.translatePlaceholder(placeholder);
  }

  resetFilters(): void {
    const form = this.filterForm();
    if (form) {
      this.filtersService.resetFilters(form, this.config());
    }
  }

  private initializeForm(): void {
    effect(() => {
      const formConfig = this.config();
      if (formConfig.length > 0) {
        const form = this.filtersService.createFilterForm(formConfig);
        this.filterForm.set(form);
      }
    });
  }

  private setupFormSubscription(): void {
    effect(() => {
      const form = this.filterForm();
      if (form) {
        this.filtersService
          .getFilterChanges(form)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(values => {
            this.filtersChanged.emit(values);
          });
      }
    });
  }
}
