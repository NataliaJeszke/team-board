import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { selectCurrentUser } from '@core/auth/store/auth.selectors';

import { HeaderComponent } from '@common/components/header/header.component';
import { UserTasksComponent } from "@view/user-tasks/user-tasks.component";

@Component({
  selector: 'tb-board',
  imports: [AsyncPipe, ButtonModule, HeaderComponent, UserTasksComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private userStore = inject(Store);

  currentUser$ = this.userStore.select(selectCurrentUser);
}
