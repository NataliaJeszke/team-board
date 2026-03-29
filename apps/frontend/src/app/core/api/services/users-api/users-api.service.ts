import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '@core/api/config/constants/api-endpoints.constants';
import { UserDictionary } from '@core/api/models/users/users-api.model';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private http = inject(HttpClient);

  getUsersDictionary(): Observable<UserDictionary> {
    return this.http.get<UserDictionary>(API_ENDPOINTS.USERS.DICTIONARY);
  }
}