import { Injectable } from '@angular/core';

import { FilterConfig, FilterOption } from '@common/components/filters/model/filters.model';

import { TASK_FILTERS_CONFIG } from '../constants/tasks-filters.constants';
import { UserForFilters } from '../model/tasks-filters.model';


@Injectable({ providedIn: 'root' })
export class TasksFiltersService {

  buildConfig(availableUsers: UserForFilters[]): FilterConfig[] {
    const userOptions = this.createUserOptions(availableUsers);

    return TASK_FILTERS_CONFIG.map(filter => {
      if (filter.key === 'authorId' || filter.key === 'assigneeId') {
        return {
          ...filter,
          options: userOptions,
        };
      }
      return filter;
    });
  }

  private createUserOptions(users: UserForFilters[]): FilterOption[] {
    return users.map(user => ({
      label: user.name,
      value: user.id,
    }));
  }
}