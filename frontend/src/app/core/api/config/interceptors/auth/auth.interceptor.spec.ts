/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { signal } from '@angular/core';

import { authInterceptor } from './auth.interceptor';
import { AuthFacade } from '@core/auth/auth.facade';

describe('authInterceptor', () => {
  let interceptor: HttpInterceptorFn;

  const createInterceptor = () =>
    (req: HttpRequest<any>, next: any) =>
      TestBed.runInInjectionContext(() => authInterceptor(req, next));

  const createAuthFacadeMock = (tokenValue: string | null): Partial<AuthFacade> => ({
    token: signal<string | null>(tokenValue),
  });

  it('should be created', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthFacade, useValue: createAuthFacadeMock('abc123') }],
    });

    interceptor = createInterceptor();
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when token exists', () => {
    const authFacadeMock = createAuthFacadeMock('abc123');

    TestBed.configureTestingModule({
      providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
    });

    interceptor = createInterceptor();

    const req = new HttpRequest('GET', '/test');
    const next = jest.fn().mockReturnValue('next called');

    interceptor(req, next);

    const clonedReq = next.mock.calls[0][0] as HttpRequest<any>;
    expect(clonedReq.headers.get('Authorization')).toBe('Bearer abc123');
  });

  it('should not add Authorization header when token does not exist', () => {
    const authFacadeMock = createAuthFacadeMock(null);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
    });

    interceptor = createInterceptor();

    const req = new HttpRequest('GET', '/test');
    const next = jest.fn().mockReturnValue('next called');

    interceptor(req, next);

    const calledReq = next.mock.calls[0][0] as HttpRequest<any>;
    expect(calledReq).toBe(req);
  });
});