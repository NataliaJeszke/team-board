import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

import { User } from '@core/models';

import { Task } from '@feature/tasks/tasks.model';

import { TaskComponent } from '@common/components/task/task.component';

@Component({
  selector: 'tb-user-tasks',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule, BadgeModule, TranslateModule, TaskComponent],
  templateUrl: './user-tasks-list.component.html',
})
export class UserTasksComponent {
  readonly user_ = input.required<User>();
  readonly tasks_ = input<Task[]>([]);
  readonly loading_ = input<boolean>(false);


  // ngOnInit(): void {
  //   this.tasksFacade.loadTasks();
  // }

  // onEdit(task: Task): void {
  //   // TODO: Open edit dialog
  //   console.log('Edit task:', task);
  // }

  // onDelete(task: Task): void {
  //   this.tasksFacade.deleteTask(task.id);
  // }

  // onStatusChange(event: { task: Task; newStatus: TaskStatus }): void {
  //   this.tasksFacade.changeTaskStatus(event.task.id, event.newStatus);
  // }
}
