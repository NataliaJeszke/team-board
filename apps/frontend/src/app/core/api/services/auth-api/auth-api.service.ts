import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@team-board/api-client';
import { AuthResponse } from '@core/api/models/auth/auth-api.model';
import { User, RegisterRequest, LoginRequest } from '@core/models';

/**
 * Adapter for generated API client
 * Uses auto-generated AuthService from OpenAPI spec
 */
@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private authService = inject(AuthService);

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.authService.authControllerRegister(data) as Observable<AuthResponse>;
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.authService.authControllerLogin(data) as Observable<AuthResponse>;
  }

  getProfile(): Observable<User> {
    return this.authService.authControllerGetProfile() as Observable<User>;
  }
}
