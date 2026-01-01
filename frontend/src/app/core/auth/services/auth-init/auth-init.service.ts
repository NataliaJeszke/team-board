import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthActions } from '@core/auth/store/auth.actions';
import { selectAuthInitialized } from '@core/auth/store/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthInitService {
  private store = inject(Store);

  initializeAuth(): Observable<boolean> {
    this.store.dispatch(AuthActions.initAuth());

    return this.store.select(selectAuthInitialized).pipe(
      filter(initialized => initialized),
      take(1),
      timeout(5000)
    );
  }
}
