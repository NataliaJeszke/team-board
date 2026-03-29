/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { concat, delay, firstValueFrom, of } from 'rxjs';
import { authGuard } from './auth.guard';
import { selectIsAuthenticated, selectAuthInitialized } from '../../store/auth.selectors';

describe('authGuard', () => {
  let store: MockStore;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => authGuard(route, state));

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

  it('should allow access when authenticated', async () => {
    store.overrideSelector(selectAuthInitialized, true);
    store.overrideSelector(selectIsAuthenticated, true);

    const result = await firstValueFrom(executeGuard(dummyRoute, dummyState) as any);
    expect(result).toBe(true);
  });

  it('should deny access and navigate to login when not authenticated', async () => {
    store.overrideSelector(selectAuthInitialized, true);
    store.overrideSelector(selectIsAuthenticated, false);

    const result = await firstValueFrom(executeGuard(dummyRoute, dummyState) as any);
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should wait for auth initialization before checking authentication', async () => {
    const init$ = concat(of(false), of(true).pipe(delay(0)));
    const auth$ = of(true);

    store.select = jest.fn(selector => {
      if (selector === selectAuthInitialized) return init$;
      if (selector === selectIsAuthenticated) return auth$;
      return of(null);
    }) as any;

    const result = await firstValueFrom(executeGuard(dummyRoute, dummyState) as any);
    expect(result).toBe(true);
  });
});
