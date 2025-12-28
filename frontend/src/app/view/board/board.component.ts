import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { AuthActions } from '@core/auth/store/auth.actions';
import { selectCurrentUser } from '@core/auth/store/auth.selectors';

import { HeaderComponent } from '@common/components/header/header.component';

@Component({
  selector: 'tb-board',
  imports: [AsyncPipe, ButtonModule, HeaderComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private store = inject(Store);

  currentUser$ = this.store.select(selectCurrentUser);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
