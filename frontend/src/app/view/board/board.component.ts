import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { selectCurrentUser } from '@core/auth/store/auth.selectors';

import { HeaderComponent } from '@common/components/header/header.component';
import { UserTasksComponent } from '@view/board/user-tasks-list/user-tasks-list.component';

@Component({
  selector: 'tb-board',
  imports: [AsyncPipe, ButtonModule, HeaderComponent, UserTasksComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent {
  private userStore = inject(Store);

  currentUser$ = this.userStore.select(selectCurrentUser);
}
