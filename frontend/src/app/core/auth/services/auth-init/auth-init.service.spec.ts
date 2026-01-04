import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockInstance, MockProvider} from 'ng-mocks';
import { of } from 'rxjs';

import { AuthActions } from '@core/auth/store/auth.actions';
import { selectAuthInitialized } from '@core/auth/store/auth.selectors';

import { AuthInitService } from './auth-init.service';

describe('AuthInitService', () => {
  MockInstance.scope();

  let service: AuthInitService;
  let storeDispatchMock: jest.Mock;
  let storeSelectMock: jest.Mock;

  beforeEach(() => {
    storeDispatchMock = jest.fn();
    storeSelectMock = jest.fn().mockReturnValue(of(true));

    MockInstance(Store, () => ({
      dispatch: storeDispatchMock,
      select: storeSelectMock,
    }));

    TestBed.configureTestingModule({
      providers: [MockProvider(Store), AuthInitService],
    });

    service = TestBed.inject(AuthInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeAuth', () => {
    it('should dispatch initAuth action', () => {
      // Act
      service.initializeAuth();

      // Assert
      expect(storeDispatchMock).toHaveBeenCalledWith(AuthActions.initAuth());
    });

    it('should select authInitialized state', () => {
      // Act
      service.initializeAuth();

      // Assert
      expect(storeSelectMock).toHaveBeenCalledWith(selectAuthInitialized);
    });

    it('should return observable that emits when initialized is true', (done) => {
      // Arrange
      storeSelectMock.mockReturnValue(of(true));

      // Act
      service.initializeAuth().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        done();
      });
    });

    it('should filter out false values and only emit when initialized is true', (done) => {
      // Arrange
      storeSelectMock.mockReturnValue(of(false, false, true));

      // Act
      service.initializeAuth().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        done();
      });
    });
  });
});
