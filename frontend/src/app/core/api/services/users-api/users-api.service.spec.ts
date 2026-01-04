import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { MockInstance, MockProvider } from 'ng-mocks';

import { UsersApiService } from './users-api.service';
import { API_ENDPOINTS } from '@core/api/config/constants/api-endpoints.constants';
import { UserDictionary } from '@core/api/models/users/users-api.model';

describe('UsersApiService', () => {
  MockInstance.scope();

  const mockUserDictionary: UserDictionary = {
    1: { id: 1, name: 'user1' },
    2: { id: 2, name: 'user2' },
  };

  let service: UsersApiService;
  let httpGetMock: jest.Mock;

  beforeEach(() => {
    httpGetMock = jest.fn().mockReturnValue(of(mockUserDictionary));

    MockInstance(HttpClient, () => ({
      get: httpGetMock,
    }));

    TestBed.configureTestingModule({
      providers: [MockProvider(HttpClient), UsersApiService],
    });

    service = TestBed.inject(UsersApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsersDictionary', () => {
    it('should call correct endpoint and return user dictionary', () => {
      // Act
      service.getUsersDictionary();

      // Assert
      expect(httpGetMock).toHaveBeenCalledWith(API_ENDPOINTS.USERS.DICTIONARY);
    });
  });
});
