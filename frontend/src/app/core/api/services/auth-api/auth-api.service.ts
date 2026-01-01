import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '@core/api/config/constants/api-endpoints.constants';
import { AuthResponse } from '@core/api/models/auth/auth-api.model';
import { User, RegisterRequest, LoginRequest } from '@core/models';


@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  }
}
