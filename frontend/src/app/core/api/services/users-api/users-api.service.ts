import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { UserDictionary } from '@core/api/models/users/users-api.model';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  getUsersDictionary(): Observable<UserDictionary> {
    return this.http.get<UserDictionary>(`${this.apiUrl}/dictionary`).pipe(
      tap(dictionary => {
        console.log('📦 Users dictionary:', dictionary);
      })
    );
  }
}