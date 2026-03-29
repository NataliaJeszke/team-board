import { Injectable, inject, signal } from '@angular/core';

import { UsersApiService } from '@core/api/services/users-api/users-api.service';
import { UserDictionary } from '@core/api/models/users/users-api.model';

@Injectable({
  providedIn: 'root',
})
export class UsersDictionaryFacade {
  private usersApi = inject(UsersApiService);

  private _dictionary = signal<UserDictionary>({});
  readonly dictionary = this._dictionary.asReadonly();

  loadUsersDictionary(): void {
    this.usersApi.getUsersDictionary().subscribe(dict => {
      this._dictionary.set(dict);
    });
  }
}
