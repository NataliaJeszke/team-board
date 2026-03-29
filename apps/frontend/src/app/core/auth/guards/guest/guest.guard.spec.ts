/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { firstValueFrom, of, concat } from 'rxjs';
import { delay } from 'rxjs/operators';

import { selectAuthInitialized, selectIsAuthenticated } from '@core/auth/store/auth.selectors';

import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
  let store: MockStore;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => guestGuard(route, state));

  beforeEach(() => {
    const routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [provideMockStore(), { provide: Router, useValue: routerMock }],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when not authenticated', async () => {
    store.select = jest.fn(selector => {
      if (selector === selectAuthInitialized) return of(true);
      if (selector === selectIsAuthenticated) return of(false);
      return of(null);
    }) as any;

    const result = await firstValueFrom(executeGuard(dummyRoute, dummyState) as any);
    expect(result).toBe(true);
  });

  it('should deny access and navigate to board when authenticated', async () => {
    store.select = jest.fn(selector => {
      if (selector === selectAuthInitialized) return of(true);
      if (selector === selectIsAuthenticated) return of(true);
      return of(null);
    }) as any;

    const result = await firstValueFrom(executeGuard(dummyRoute, dummyState) as any);
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/board']);
  });

  it('should wait for auth initialization before checking authentication', async () => {
    const init$ = concat(of(false), of(true).pipe(delay(0)));
    const auth$ = of(false);

    store.select = jest.fn(selector => {
      if (selector === selectAuthInitialized) return init$;
      if (selector === selectIsAuthenticated) return auth$;
      return of(null);
    }) as any;

    const result = await firstValueFrom(executeGuard(dummyRoute, dummyState) as any);
    expect(result).toBe(true);
  });
});
