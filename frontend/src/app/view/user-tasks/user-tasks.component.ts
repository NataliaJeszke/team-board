import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Task, TaskStatus } from '@core/models/task.model';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { TranslateModule } from '@ngx-translate/core';

import { TaskComponent } from '@common/components/task/task.component';
import { selectAllTasks, selectTasksLoading } from './store/tasks/task.selectors';
import { TaskActions } from './store/tasks/task.actions';
import { CreateTaskDto } from '@core/api/models/task/task.model';

@Component({
  selector: 'tb-user-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    BadgeModule,
    TranslateModule,
    TaskComponent,
  ],
  templateUrl: './user-tasks.component.html',
})
export class UserTasksComponent {
  private taskStore = inject(Store);

  readonly tasks$ = this.taskStore.select(selectAllTasks);
  readonly loading$ = this.taskStore.select(selectTasksLoading);

  readonly currentUserId = 1;

  constructor() {
    this.taskStore.dispatch(TaskActions.loadTasks());
  }


  onCreateTask(taskData: CreateTaskDto) {
    this.taskStore.dispatch(
      TaskActions.createTask({ task: taskData })
    );
  }

  onStatusChange(event: { task: Task; newStatus: TaskStatus }) {
    this.taskStore.dispatch(
      TaskActions.updateTask({
        id: event.task.id,
        task: {
            status: event.newStatus,
            title: '',
            assignedToId: 0,
            priority: 'low'
        },
      })
    );
  }

  onDeleteTask(task: Task) {
    this.taskStore.dispatch(
      TaskActions.deleteTask({ id: task.id })
    );
  }

  onEditTask(task: Task) {
    console.log('edit', task)
  }
}