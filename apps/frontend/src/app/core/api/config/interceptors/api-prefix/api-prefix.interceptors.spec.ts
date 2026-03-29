import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpHandlerFn } from '@angular/common/http';
import { of } from 'rxjs';

import { apiPrefixInterceptor } from './api-prefix.interceptor';
import { API_CONFIG } from '@core/api/config/tokens/api-config.token';

describe('apiPrefixInterceptor', () => {
  const mockApiConfig = { baseUrl: 'https://api.example.com' };

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => apiPrefixInterceptor(req, next));

  const nextHandler: HttpHandlerFn = (req: HttpRequest<unknown>) =>
    of(new HttpResponse({ body: req.url, status: 200 }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: API_CONFIG, useValue: mockApiConfig }],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should not prefix URLs that start with http', done => {
    const req = new HttpRequest<string>('GET', 'http://external.com/data');
    interceptor(req, nextHandler).subscribe(response => {
      if (response instanceof HttpResponse) {
        expect(response.body).toBe('http://external.com/data');
        done();
      }
    });
  });

  it('should not prefix URLs that start with assets/', done => {
    const req = new HttpRequest<string>('GET', 'assets/image.png');
    interceptor(req, nextHandler).subscribe(response => {
      if (response instanceof HttpResponse) {
        expect(response.body).toBe('assets/image.png');
        done();
      }
    });
  });

  it('should not prefix URLs that start with ./assets/', done => {
    const req = new HttpRequest<string>('GET', './assets/file.txt');
    interceptor(req, nextHandler).subscribe(response => {
      if (response instanceof HttpResponse) {
        expect(response.body).toBe('./assets/file.txt');
        done();
      }
    });
  });

  it('should prefix relative API URLs', done => {
    const req = new HttpRequest<string>('GET', '/tasks');
    interceptor(req, nextHandler).subscribe(response => {
      if (response instanceof HttpResponse) {
        expect(response.body).toBe('https://api.example.com/tasks');
        done();
      }
    });
  });
});
