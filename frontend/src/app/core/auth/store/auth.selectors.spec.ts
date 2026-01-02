import {
  selectAuthState,
  selectToken,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthInitialized,
  selectUserName,
  selectUserEmail,
} from './auth.selectors';
import { AuthState, initialState } from './auth.state';
import { User } from '@core/models';

describe('Auth Selectors', () => {
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  describe('selectAuthState', () => {
    it('should select the auth state', () => {
      const state = {
        auth: initialState,
      };

      const result = selectAuthState(state);

      expect(result).toEqual(initialState);
    });

    it('should select auth state with user data', () => {
      const authState: AuthState = {
        token: 'jwt-token',
        user: mockUser,
        loading: false,
        error: null,
        initialized: true,
      };

      const state = {
        auth: authState,
      };

      const result = selectAuthState(state);

      expect(result).toEqual(authState);
    });
  });

  describe('selectToken', () => {
    it('should select null token from initial state', () => {
      const state = {
        auth: initialState,
      };

      const result = selectToken.projector(state.auth);

      expect(result).toBeNull();
    });

    it('should select token when present', () => {
      const authState: AuthState = {
        ...initialState,
        token: 'mock-jwt-token',
      };

      const result = selectToken.projector(authState);

      expect(result).toBe('mock-jwt-token');
    });

    it('should select null when token is explicitly null', () => {
      const authState: AuthState = {
        ...initialState,
        token: null,
      };

      const result = selectToken.projector(authState);

      expect(result).toBeNull();
    });

    it('should handle very long token strings', () => {
      const longToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'.repeat(10);
      const authState: AuthState = {
        ...initialState,
        token: longToken,
      };

      const result = selectToken.projector(authState);

      expect(result).toBe(longToken);
    });
  });

  describe('selectCurrentUser', () => {
    it('should select null user from initial state', () => {
      const result = selectCurrentUser.projector(initialState);

      expect(result).toBeNull();
    });

    it('should select user when present', () => {
      const authState: AuthState = {
        ...initialState,
        user: mockUser,
      };

      const result = selectCurrentUser.projector(authState);

      expect(result).toEqual(mockUser);
    });

    it('should select user with all properties', () => {
      const fullUser: User = {
        id: 42,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      };

      const authState: AuthState = {
        ...initialState,
        user: fullUser,
      };

      const result = selectCurrentUser.projector(authState);

      expect(result).toEqual(fullUser);
      expect(result?.id).toBe(42);
      expect(result?.name).toBe('Jane Smith');
      expect(result?.email).toBe('jane.smith@example.com');
    });

    it('should handle user with minimal data', () => {
      const minimalUser: User = {
        id: 1,
        name: 'A',
        email: 'a@b.c',
      };

      const authState: AuthState = {
        ...initialState,
        user: minimalUser,
      };

      const result = selectCurrentUser.projector(authState);

      expect(result).toEqual(minimalUser);
    });
  });

  describe('selectIsAuthenticated', () => {
    it('should return false when no token and no user', () => {
      const result = selectIsAuthenticated.projector(initialState);

      expect(result).toBe(false);
    });

    it('should return false when token exists but no user', () => {
      const authState: AuthState = {
        ...initialState,
        token: 'jwt-token',
        user: null,
      };

      const result = selectIsAuthenticated.projector(authState);

      expect(result).toBe(false);
    });

    it('should return false when user exists but no token', () => {
      const authState: AuthState = {
        ...initialState,
        token: null,
        user: mockUser,
      };

      const result = selectIsAuthenticated.projector(authState);

      expect(result).toBe(false);
    });

    it('should return true when both token and user exist', () => {
      const authState: AuthState = {
        ...initialState,
        token: 'jwt-token',
        user: mockUser,
      };

      const result = selectIsAuthenticated.projector(authState);

      expect(result).toBe(true);
    });

    it('should return false with empty string token', () => {
      const authState: AuthState = {
        ...initialState,
        token: '',
        user: mockUser,
      };

      const result = selectIsAuthenticated.projector(authState);

      expect(result).toBe(false);
    });
  });

  describe('selectAuthLoading', () => {
    it('should return false from initial state', () => {
      const result = selectAuthLoading.projector(initialState);

      expect(result).toBe(false);
    });

    it('should return true when loading', () => {
      const authState: AuthState = {
        ...initialState,
        loading: true,
      };

      const result = selectAuthLoading.projector(authState);

      expect(result).toBe(true);
    });

    it('should return false when not loading', () => {
      const authState: AuthState = {
        ...initialState,
        loading: false,
      };

      const result = selectAuthLoading.projector(authState);

      expect(result).toBe(false);
    });
  });

  describe('selectAuthError', () => {
    it('should return null from initial state', () => {
      const result = selectAuthError.projector(initialState);

      expect(result).toBeNull();
    });

    it('should return error message when present', () => {
      const errorMessage = 'Invalid credentials';
      const authState: AuthState = {
        ...initialState,
        error: errorMessage,
      };

      const result = selectAuthError.projector(authState);

      expect(result).toBe(errorMessage);
    });

    it('should return null when error is explicitly null', () => {
      const authState: AuthState = {
        ...initialState,
        error: null,
      };

      const result = selectAuthError.projector(authState);

      expect(result).toBeNull();
    });

    it('should handle empty string error', () => {
      const authState: AuthState = {
        ...initialState,
        error: '',
      };

      const result = selectAuthError.projector(authState);

      expect(result).toBe('');
    });

    it('should handle long error messages', () => {
      const longError =
        'A very long error message that might contain detailed information about what went wrong during the authentication process';
      const authState: AuthState = {
        ...initialState,
        error: longError,
      };

      const result = selectAuthError.projector(authState);

      expect(result).toBe(longError);
    });
  });

  describe('selectAuthInitialized', () => {
    it('should return false from initial state', () => {
      const result = selectAuthInitialized.projector(initialState);

      expect(result).toBe(false);
    });

    it('should return true when initialized', () => {
      const authState: AuthState = {
        ...initialState,
        initialized: true,
      };

      const result = selectAuthInitialized.projector(authState);

      expect(result).toBe(true);
    });

    it('should return false when not initialized', () => {
      const authState: AuthState = {
        ...initialState,
        initialized: false,
      };

      const result = selectAuthInitialized.projector(authState);

      expect(result).toBe(false);
    });
  });

  describe('selectUserName', () => {
    it('should return null when user is null', () => {
      const result = selectUserName.projector(null);

      expect(result).toBeNull();
    });

    it('should return user name when user exists', () => {
      const result = selectUserName.projector(mockUser);

      expect(result).toBe('John Doe');
    });

    it('should handle user with single character name', () => {
      const user: User = {
        ...mockUser,
        name: 'X',
      };

      const result = selectUserName.projector(user);

      expect(result).toBe('X');
    });

    it('should handle user with long name', () => {
      const user: User = {
        ...mockUser,
        name: 'Alexander Maximilian Christopher Johnson-Smith',
      };

      const result = selectUserName.projector(user);

      expect(result).toBe('Alexander Maximilian Christopher Johnson-Smith');
    });

    it('should handle user with empty name', () => {
      const user: User = {
        ...mockUser,
        name: '',
      };

      const result = selectUserName.projector(user);

      expect(result).toBe('');
    });

    it('should handle user with name containing special characters', () => {
      const user: User = {
        ...mockUser,
        name: "John O'Connor-Müller",
      };

      const result = selectUserName.projector(user);

      expect(result).toBe("John O'Connor-Müller");
    });
  });

  describe('selectUserEmail', () => {
    it('should return undefined when user is null', () => {
      const result = selectUserEmail.projector(null);

      expect(result).toBeUndefined();
    });

    it('should return undefined when user is undefined', () => {
      const result = selectUserEmail.projector(undefined);

      expect(result).toBeUndefined();
    });

    it('should return email when user exists', () => {
      const result = selectUserEmail.projector(mockUser);

      expect(result).toBe('john@example.com');
    });

    it('should handle email with plus addressing', () => {
      const user: User = {
        ...mockUser,
        email: 'user+test@example.com',
      };

      const result = selectUserEmail.projector(user);

      expect(result).toBe('user+test@example.com');
    });

    it('should handle email with subdomain', () => {
      const user: User = {
        ...mockUser,
        email: 'user@mail.example.com',
      };

      const result = selectUserEmail.projector(user);

      expect(result).toBe('user@mail.example.com');
    });

    it('should handle short email addresses', () => {
      const user: User = {
        ...mockUser,
        email: 'a@b.c',
      };

      const result = selectUserEmail.projector(user);

      expect(result).toBe('a@b.c');
    });
  });

  describe('Selector Composition', () => {
    it('should compose selectToken from selectAuthState', () => {
      const authState: AuthState = {
        ...initialState,
        token: 'test-token',
      };

      const state = { auth: authState };

      expect(selectToken(state)).toBe('test-token');
    });

    it('should compose selectCurrentUser from selectAuthState', () => {
      const authState: AuthState = {
        ...initialState,
        user: mockUser,
      };

      const state = { auth: authState };

      expect(selectCurrentUser(state)).toEqual(mockUser);
    });

    it('should compose selectIsAuthenticated from selectAuthState', () => {
      const authState: AuthState = {
        ...initialState,
        token: 'token',
        user: mockUser,
      };

      const state = { auth: authState };

      expect(selectIsAuthenticated(state)).toBe(true);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle state with all properties set to boundary values', () => {
      const authState: AuthState = {
        token: '',
        user: null,
        loading: false,
        error: '',
        initialized: false,
      };

      expect(selectToken.projector(authState)).toBe('');
      expect(selectCurrentUser.projector(authState)).toBeNull();
      expect(selectAuthLoading.projector(authState)).toBe(false);
      expect(selectAuthError.projector(authState)).toBe('');
      expect(selectAuthInitialized.projector(authState)).toBe(false);
    });

    it('should handle state transition from authenticated to unauthenticated', () => {
      // Authenticated state
      const authenticatedState: AuthState = {
        token: 'jwt-token',
        user: mockUser,
        loading: false,
        error: null,
        initialized: true,
      };

      expect(selectIsAuthenticated.projector(authenticatedState)).toBe(true);
      expect(selectCurrentUser.projector(authenticatedState)).toEqual(mockUser);

      // After logout
      const unauthenticatedState: AuthState = {
        token: null,
        user: null,
        loading: false,
        error: null,
        initialized: true,
      };

      expect(selectIsAuthenticated.projector(unauthenticatedState)).toBe(false);
      expect(selectCurrentUser.projector(unauthenticatedState)).toBeNull();
    });

    it('should handle concurrent state with loading and error', () => {
      const authState: AuthState = {
        token: null,
        user: null,
        loading: true,
        error: 'Network error',
        initialized: false,
      };

      expect(selectAuthLoading.projector(authState)).toBe(true);
      expect(selectAuthError.projector(authState)).toBe('Network error');
      expect(selectIsAuthenticated.projector(authState)).toBe(false);
    });

    it('should handle user with only required fields', () => {
      const minimalUser: User = {
        id: 0,
        name: '',
        email: '',
      };

      const authState: AuthState = {
        ...initialState,
        user: minimalUser,
        token: 'token',
      };

      expect(selectCurrentUser.projector(authState)).toEqual(minimalUser);
      expect(selectUserName.projector(minimalUser)).toBe('');
      expect(selectUserEmail.projector(minimalUser)).toBe('');
      // Empty token string makes isAuthenticated false
      expect(selectIsAuthenticated.projector(authState)).toBe(true);
    });
  });

  describe('Memoization', () => {
    it('should return same reference when state has not changed', () => {
      const authState: AuthState = {
        ...initialState,
        token: 'token',
        user: mockUser,
      };

      const result1 = selectCurrentUser.projector(authState);
      const result2 = selectCurrentUser.projector(authState);

      expect(result1).toBe(result2);
    });

    it('should use memoized result for composed selectors', () => {
      const authState: AuthState = {
        ...initialState,
        user: mockUser,
      };

      const userName1 = selectUserName.projector(authState.user);
      const userName2 = selectUserName.projector(authState.user);

      expect(userName1).toBe(userName2);
    });
  });
});
