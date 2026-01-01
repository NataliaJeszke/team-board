import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { FilterConfig, FilterOption, FilterValues } from '../model/filters.model';

@Injectable()
export class FiltersService {
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  createFilterForm(config: readonly FilterConfig[]): FormGroup {
    const controlsConfig: Record<string, FormControl> = {};

    config.forEach(filter => {
      const initialValue = this.getInitialValue(filter);
      controlsConfig[filter.key] = new FormControl(initialValue);
    });

    return this.fb.group(controlsConfig);
  }

  getFilterChanges(form: FormGroup): Observable<FilterValues> {
    return form.valueChanges.pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );
  }

  translateOptions(options: readonly FilterOption[]): FilterOption[] {
    return options.map(option => ({
      ...option,
      label: this.translate.instant(option.label),
    }));
  }

  translatePlaceholder(key: string): string {
    return this.translate.instant(key);
  }

  resetFilters(form: FormGroup, config: readonly FilterConfig[]): void {
    const resetValues: Record<string, unknown> = {};

    config.forEach(filter => {
      resetValues[filter.key] = this.getInitialValue(filter);
    });

    form.patchValue(resetValues);
  }

  private getInitialValue(filter: FilterConfig): string | number | null {
    if (filter.defaultValue !== undefined) {
      return filter.defaultValue;
    }
    return filter.type === 'date' ? null : '';
  }
}