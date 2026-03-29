import { TestBed } from '@angular/core/testing';

import { User } from '@core/models';

import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;
  let sessionStorageGetItemMock: jest.Mock;
  let sessionStorageSetItemMock: jest.Mock;
  let sessionStorageRemoveItemMock: jest.Mock;

  const mockUser: User = {
    id: 1,
    name: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(() => {
    sessionStorageGetItemMock = jest.fn();
    sessionStorageSetItemMock = jest.fn();
    sessionStorageRemoveItemMock = jest.fn();

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: sessionStorageGetItemMock,
        setItem: sessionStorageSetItemMock,
        removeItem: sessionStorageRemoveItemMock,
      },
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [TokenStorageService],
    });

    service = TestBed.inject(TokenStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveToken', () => {
    it('should save token to sessionStorage', () => {
      // Arrange
      const token = 'test-token-123';

      // Act
      service.saveToken(token);

      // Assert
      expect(sessionStorageSetItemMock).toHaveBeenCalledWith('auth_token', token);
    });
  });

  describe('getToken', () => {
    it('should return token from sessionStorage', () => {
      // Arrange
      const token = 'test-token-123';
      sessionStorageGetItemMock.mockReturnValue(token);

      // Act
      const result = service.getToken();

      // Assert
      expect(sessionStorageGetItemMock).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(token);
    });

    it('should return null when no token exists', () => {
      // Arrange
      sessionStorageGetItemMock.mockReturnValue(null);

      // Act
      const result = service.getToken();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('should remove token from sessionStorage', () => {
      // Act
      service.removeToken();

      // Assert
      expect(sessionStorageRemoveItemMock).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('saveUser', () => {
    it('should save user to sessionStorage as JSON string', () => {
      // Act
      service.saveUser(mockUser);

      // Assert
      expect(sessionStorageSetItemMock).toHaveBeenCalledWith('auth_user', JSON.stringify(mockUser));
    });
  });

  describe('getUser', () => {
    it('should return parsed user from sessionStorage', () => {
      // Arrange
      sessionStorageGetItemMock.mockReturnValue(JSON.stringify(mockUser));

      // Act
      const result = service.getUser();

      // Assert
      expect(sessionStorageGetItemMock).toHaveBeenCalledWith('auth_user');
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user exists', () => {
      // Arrange
      sessionStorageGetItemMock.mockReturnValue(null);

      // Act
      const result = service.getUser();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('removeUser', () => {
    it('should remove user from sessionStorage', () => {
      // Act
      service.removeUser();

      // Assert
      expect(sessionStorageRemoveItemMock).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('clear', () => {
    it('should remove both token and user from sessionStorage', () => {
      // Act
      service.clear();

      // Assert
      expect(sessionStorageRemoveItemMock).toHaveBeenCalledWith('auth_token');
      expect(sessionStorageRemoveItemMock).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('hasToken', () => {
    it('should return true when token exists', () => {
      // Arrange
      sessionStorageGetItemMock.mockReturnValue('test-token-123');

      // Act
      const result = service.hasToken();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when token does not exist', () => {
      // Arrange
      sessionStorageGetItemMock.mockReturnValue(null);

      // Act
      const result = service.hasToken();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when token is empty string', () => {
      // Arrange
      sessionStorageGetItemMock.mockReturnValue('');

      // Act
      const result = service.hasToken();

      // Assert
      expect(result).toBe(false);
    });
  });
});
