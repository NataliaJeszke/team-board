import { TestBed, getTestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AuthFacade } from './auth.facade';
import { AuthActions } from './store/auth.actions';
import { LoginRequest, RegisterRequest, User } from '@core/models';
import {
  selectToken,
  selectAuthError,
  selectAuthLoading,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthInitialized,
} from './store/auth.selectors';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let store: MockStore;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  const initialState = {
    auth: {
      token: null,
      user: null,
      loading: false,
      error: null,
      initialized: false,
    },
  };

  beforeAll(() => {
    getTestBed().initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthFacade, provideMockStore({ initialState })],
    });

    facade = TestBed.inject(AuthFacade);
    store = TestBed.inject(MockStore);

    // Spy on dispatch method
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Facade Creation', () => {
    it('should be created', () => {
      expect(facade).toBeTruthy();
    });

    it('should have all required signals', () => {
      expect(facade.user).toBeDefined();
      expect(facade.isAuthenticated).toBeDefined();
      expect(facade.loading).toBeDefined();
      expect(facade.error).toBeDefined();
      expect(facade.token).toBeDefined();
      expect(facade.initialized).toBeDefined();
    });
  });

  describe('Selectors as Signals', () => {
    it('should expose user signal with initial null value', () => {
      store.overrideSelector(selectCurrentUser, null);
      store.refreshState();

      expect(facade.user()).toBeNull();
    });

    it('should expose user signal with user data', () => {
      store.overrideSelector(selectCurrentUser, mockUser);
      store.refreshState();

      expect(facade.user()).toEqual(mockUser);
    });

    it('should expose isAuthenticated signal with false when not authenticated', () => {
      store.overrideSelector(selectIsAuthenticated, false);
      store.refreshState();

      expect(facade.isAuthenticated()).toBe(false);
    });

    it('should expose isAuthenticated signal with true when authenticated', () => {
      store.overrideSelector(selectIsAuthenticated, true);
      store.refreshState();

      expect(facade.isAuthenticated()).toBe(true);
    });

    it('should expose loading signal', () => {
      store.overrideSelector(selectAuthLoading, true);
      store.refreshState();

      expect(facade.loading()).toBe(true);
    });

    it('should expose error signal with null when no error', () => {
      store.overrideSelector(selectAuthError, null);
      store.refreshState();

      expect(facade.error()).toBeNull();
    });

    it('should expose error signal with error message', () => {
      const errorMessage = 'Invalid credentials';
      store.overrideSelector(selectAuthError, errorMessage);
      store.refreshState();

      expect(facade.error()).toBe(errorMessage);
    });

    it('should expose token signal with null when no token', () => {
      store.overrideSelector(selectToken, null);
      store.refreshState();

      expect(facade.token()).toBeNull();
    });

    it('should expose token signal with token value', () => {
      const token = 'mock-jwt-token';
      store.overrideSelector(selectToken, token);
      store.refreshState();

      expect(facade.token()).toBe(token);
    });

    it('should expose initialized signal', () => {
      store.overrideSelector(selectAuthInitialized, true);
      store.refreshState();

      expect(facade.initialized()).toBe(true);
    });
  });

  describe('login()', () => {
    it('should dispatch login action with credentials', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      facade.login(credentials);

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.login({ credentials })
      );
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should handle login with different email formats', () => {
      const credentials: LoginRequest = {
        email: 'user+test@example.com',
        password: 'password',
      };

      facade.login(credentials);

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.login({ credentials })
      );
    });

    it('should dispatch login action multiple times for different users', () => {
      const credentials1: LoginRequest = {
        email: 'user1@example.com',
        password: 'pass1',
      };
      const credentials2: LoginRequest = {
        email: 'user2@example.com',
        password: 'pass2',
      };

      facade.login(credentials1);
      facade.login(credentials2);

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        AuthActions.login({ credentials: credentials1 })
      );
      expect(store.dispatch).toHaveBeenNthCalledWith(
        2,
        AuthActions.login({ credentials: credentials2 })
      );
    });
  });

  describe('register()', () => {
    it('should dispatch register action with user data', () => {
      const data: RegisterRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      };

      facade.register(data);

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.register({ data })
      );
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should handle registration with long names', () => {
      const data: RegisterRequest = {
        name: 'Very Long Name That Someone Might Have In Real Life',
        email: 'longname@example.com',
        password: 'password',
      };

      facade.register(data);

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.register({ data })
      );
    });

    it('should handle registration with special characters in email', () => {
      const data: RegisterRequest = {
        name: 'Test User',
        email: 'test+filter@sub.example.com',
        password: 'password',
      };

      facade.register(data);

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.register({ data })
      );
    });
  });

  describe('logout()', () => {
    it('should dispatch logout action', () => {
      facade.logout();

      expect(store.dispatch).toHaveBeenCalledWith(AuthActions.logout());
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should dispatch logout action when called multiple times', () => {
      facade.logout();
      facade.logout();

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenNthCalledWith(1, AuthActions.logout());
      expect(store.dispatch).toHaveBeenNthCalledWith(2, AuthActions.logout());
    });
  });

  describe('Integration Scenarios', () => {
    it('should reflect authenticated state after login success', () => {
      // Initial state - not authenticated
      store.overrideSelector(selectIsAuthenticated, false);
      store.overrideSelector(selectCurrentUser, null);
      store.overrideSelector(selectToken, null);
      store.refreshState();

      expect(facade.isAuthenticated()).toBe(false);
      expect(facade.user()).toBeNull();
      expect(facade.token()).toBeNull();

      // After successful login
      const token = 'jwt-token';
      store.overrideSelector(selectIsAuthenticated, true);
      store.overrideSelector(selectCurrentUser, mockUser);
      store.overrideSelector(selectToken, token);
      store.refreshState();

      expect(facade.isAuthenticated()).toBe(true);
      expect(facade.user()).toEqual(mockUser);
      expect(facade.token()).toBe(token);
    });

    it('should reflect loading state during authentication', () => {
      // Not loading initially
      store.overrideSelector(selectAuthLoading, false);
      store.refreshState();
      expect(facade.loading()).toBe(false);

      // Loading during authentication
      store.overrideSelector(selectAuthLoading, true);
      store.refreshState();
      expect(facade.loading()).toBe(true);

      // Not loading after completion
      store.overrideSelector(selectAuthLoading, false);
      store.refreshState();
      expect(facade.loading()).toBe(false);
    });

    it('should reflect error state after failed login', () => {
      // No error initially
      store.overrideSelector(selectAuthError, null);
      store.refreshState();
      expect(facade.error()).toBeNull();

      // Error after failed login
      const errorMessage = 'Invalid credentials';
      store.overrideSelector(selectAuthError, errorMessage);
      store.refreshState();
      expect(facade.error()).toBe(errorMessage);
    });

    it('should reflect cleared state after logout', () => {
      // Authenticated state
      store.overrideSelector(selectIsAuthenticated, true);
      store.overrideSelector(selectCurrentUser, mockUser);
      store.overrideSelector(selectToken, 'token');
      store.refreshState();

      expect(facade.isAuthenticated()).toBe(true);

      // After logout
      store.overrideSelector(selectIsAuthenticated, false);
      store.overrideSelector(selectCurrentUser, null);
      store.overrideSelector(selectToken, null);
      store.refreshState();

      expect(facade.isAuthenticated()).toBe(false);
      expect(facade.user()).toBeNull();
      expect(facade.token()).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive login attempts', () => {
      const credentials1: LoginRequest = {
        email: 'user1@example.com',
        password: 'pass1',
      };
      const credentials2: LoginRequest = {
        email: 'user2@example.com',
        password: 'pass2',
      };
      const credentials3: LoginRequest = {
        email: 'user3@example.com',
        password: 'pass3',
      };

      facade.login(credentials1);
      facade.login(credentials2);
      facade.login(credentials3);

      expect(store.dispatch).toHaveBeenCalledTimes(3);
    });

    it('should handle empty error messages', () => {
      store.overrideSelector(selectAuthError, '');
      store.refreshState();

      expect(facade.error()).toBe('');
    });

    it('should handle user object with minimal data', () => {
      const minimalUser: User = {
        id: 999,
        name: 'A',
        email: 'a@b.c',
      };

      store.overrideSelector(selectCurrentUser, minimalUser);
      store.refreshState();

      expect(facade.user()).toEqual(minimalUser);
    });

    it('should handle very long error messages', () => {
      const longError = 'Error: '.repeat(100) + 'Connection timeout';
      store.overrideSelector(selectAuthError, longError);
      store.refreshState();

      expect(facade.error()).toBe(longError);
    });

    it('should handle initialized state changes', () => {
      // Not initialized
      store.overrideSelector(selectAuthInitialized, false);
      store.refreshState();
      expect(facade.initialized()).toBe(false);

      // Initialized
      store.overrideSelector(selectAuthInitialized, true);
      store.refreshState();
      expect(facade.initialized()).toBe(true);
    });
  });

  describe('Action Dispatch Verification', () => {
    it('should not modify credentials when dispatching login', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const credentialsCopy = { ...credentials };

      facade.login(credentials);

      expect(credentials).toEqual(credentialsCopy);
    });

    it('should not modify registration data when dispatching register', () => {
      const data: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const dataCopy = { ...data };

      facade.register(data);

      expect(data).toEqual(dataCopy);
    });
  });
});
