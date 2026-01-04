import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { API_ENDPOINTS } from '@core/api/config/constants/api-endpoints.constants';
import { AuthResponse } from '@core/api/models/auth/auth-api.model';
import { AuthApiService } from '@core/api/services/auth-api/auth-api.service';
import { User, RegisterRequest, LoginRequest } from '@core/models';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthApiService],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register()', () => {
    it('should send POST request to register endpoint with correct data', () => {
      const registerData: RegisterRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        } as User,
        access_token: 'mock-jwt-token',
      };

      service.register(registerData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.user.email).toBe(registerData.email);
        expect(response.access_token).toBeTruthy();
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.REGISTER);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const registerData: RegisterRequest = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123',
      };

      const mockError = {
        status: 409,
        statusText: 'Conflict',
        error: { message: 'User already exists' },
      };

      service.register(registerData).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error) => {
          expect(error.status).toBe(409);
          expect(error.error.message).toBe('User already exists');
        },
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.REGISTER);
      req.flush(mockError.error, {
        status: mockError.status,
        statusText: mockError.statusText,
      });
    });

    it('should handle network error', () => {
      const registerData: RegisterRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      service.register(registerData).subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.error.type).toBe('Network error');
        },
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.REGISTER);
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('login()', () => {
    it('should send POST request to login endpoint with correct credentials', () => {
      const loginData: LoginRequest = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        } as User,
        access_token: 'mock-jwt-token',
      };

      service.login(loginData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.access_token).toBe('mock-jwt-token');
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.LOGIN);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockResponse);
    });

    it('should handle invalid credentials error', () => {
      const loginData: LoginRequest = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      const mockError = {
        status: 401,
        statusText: 'Unauthorized',
        error: { message: 'Invalid credentials' },
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error.message).toBe('Invalid credentials');
        },
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.LOGIN);
      req.flush(mockError.error, {
        status: mockError.status,
        statusText: mockError.statusText,
      });
    });

    it('should handle empty credentials', () => {
      const loginData: LoginRequest = {
        email: '',
        password: '',
      };

      const mockError = {
        status: 400,
        statusText: 'Bad Request',
        error: { message: 'Email and password are required' },
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.LOGIN);
      req.flush(mockError.error, {
        status: mockError.status,
        statusText: mockError.statusText,
      });
    });
  });

  describe('getProfile()', () => {
    it('should send GET request to profile endpoint', () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      service.getProfile().subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(user.id).toBe(1);
        expect(user.email).toBe('john@example.com');
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.PROFILE);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle unauthorized access to profile', () => {
      const mockError = {
        status: 401,
        statusText: 'Unauthorized',
        error: { message: 'Token expired or invalid' },
      };

      service.getProfile().subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error.message).toBe('Token expired or invalid');
        },
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.PROFILE);
      req.flush(mockError.error, {
        status: mockError.status,
        statusText: mockError.statusText,
      });
    });

    it('should handle server error when fetching profile', () => {
      const mockError = {
        status: 500,
        statusText: 'Internal Server Error',
        error: { message: 'Server error' },
      };

      service.getProfile().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.PROFILE);
      req.flush(mockError.error, {
        status: mockError.status,
        statusText: mockError.statusText,
      });
    });
  });

  describe('Integration Tests', () => {
    it('should allow register and then login flow', () => {
      const registerData: RegisterRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'securepass',
      };

      const mockRegisterResponse: AuthResponse = {
        user: {
          id: 2,
          name: 'Jane Doe',
          email: 'jane@example.com',
        } as User,
        access_token: 'register-token',
      };

      // First, register
      service.register(registerData).subscribe((response) => {
        expect(response.access_token).toBe('register-token');
      });

      const registerReq = httpMock.expectOne(API_ENDPOINTS.AUTH.REGISTER);
      registerReq.flush(mockRegisterResponse);

      // Then login
      const loginData: LoginRequest = {
        email: registerData.email,
        password: registerData.password,
      };

      const mockLoginResponse: AuthResponse = {
        user: mockRegisterResponse.user,
        access_token: 'login-token',
      };

      service.login(loginData).subscribe((response) => {
        expect(response.user.email).toBe(registerData.email);
        expect(response.access_token).toBe('login-token');
      });

      const loginReq = httpMock.expectOne(API_ENDPOINTS.AUTH.LOGIN);
      loginReq.flush(mockLoginResponse);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in email', () => {
      const loginData: LoginRequest = {
        email: 'user+test@example.com',
        password: 'password',
      };

      service.login(loginData).subscribe();

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.LOGIN);
      expect(req.request.body.email).toBe('user+test@example.com');
      req.flush({ user: {} as User, access_token: 'token' });
    });

    it('should handle very long password', () => {
      const longPassword = 'a'.repeat(1000);
      const registerData: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: longPassword,
      };

      service.register(registerData).subscribe();

      const req = httpMock.expectOne(API_ENDPOINTS.AUTH.REGISTER);
      expect(req.request.body.password.length).toBe(1000);
      req.flush({ user: {} as User, access_token: 'token' });
    });

    it('should handle concurrent requests', () => {
      const loginData1: LoginRequest = {
        email: 'user1@example.com',
        password: 'pass1',
      };

      const loginData2: LoginRequest = {
        email: 'user2@example.com',
        password: 'pass2',
      };

      // Send two concurrent requests
      service.login(loginData1).subscribe();
      service.login(loginData2).subscribe();

      // Verify both requests are in flight
      const requests = httpMock.match(API_ENDPOINTS.AUTH.LOGIN);
      expect(requests.length).toBe(2);

      // Flush both
      requests[0].flush({ user: {} as User, access_token: 'token1' });
      requests[1].flush({ user: {} as User, access_token: 'token2' });
    });
  });
});