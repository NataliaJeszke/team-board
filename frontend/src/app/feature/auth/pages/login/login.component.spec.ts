import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthFacade } from '@core/auth/auth.facade';
import { LoginRequest } from '@core/models';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthFacade: {
    login: jest.Mock;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
  };

  beforeEach(async () => {
    mockAuthFacade = {
      login: jest.fn(),
      loading: signal(false),
      error: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
      providers: [
        { provide: AuthFacade, useValue: mockAuthFacade },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.form.value).toEqual({
        email: '',
        password: '',
      });
    });

    it('should have email and password controls', () => {
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });
  });

  describe('Form validation', () => {
    it('should be invalid when empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('should require email', () => {
      const email = component.form.get('email');
      expect(email?.hasError('required')).toBeTruthy();
    });

    it('should require password', () => {
      const password = component.form.get('password');
      expect(password?.hasError('required')).toBeTruthy();
    });

    it('should validate email format', () => {
      const email = component.form.get('email');
      email?.setValue('invalid-email');
      expect(email?.hasError('email')).toBeTruthy();
    });

    it('should accept valid email', () => {
      const email = component.form.get('email');
      email?.setValue('test@example.com');
      expect(email?.hasError('email')).toBeFalsy();
    });

    it('should be valid with correct email and password', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('submit()', () => {
    it('should not call authFacade.login when form is invalid', () => {
      component.form.patchValue({
        email: '',
        password: '',
      });
      component.submit();
      expect(mockAuthFacade.login).not.toHaveBeenCalled();
    });

    it('should not call authFacade.login when email is invalid', () => {
      component.form.patchValue({
        email: 'invalid-email',
        password: 'password123',
      });
      component.submit();
      expect(mockAuthFacade.login).not.toHaveBeenCalled();
    });

    it('should not call authFacade.login when password is empty', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: '',
      });
      component.submit();
      expect(mockAuthFacade.login).not.toHaveBeenCalled();
    });

    it('should call authFacade.login with form values when valid', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      component.form.patchValue(credentials);
      component.submit();

      expect(mockAuthFacade.login).toHaveBeenCalledTimes(1);
      expect(mockAuthFacade.login).toHaveBeenCalledWith(credentials);
    });

    it('should call authFacade.login with trimmed values', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      component.submit();

      expect(mockAuthFacade.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('Facade integration', () => {
    it('should expose loading signal from authFacade', () => {
      expect(component.loading).toBe(mockAuthFacade.loading);
    });

    it('should expose error signal from authFacade', () => {
      expect(component.error).toBe(mockAuthFacade.error);
    });
  });

  describe('Edge cases', () => {
    it('should handle email with special characters', () => {
      component.form.patchValue({
        email: 'user+test@example.com',
        password: 'password123',
      });
      component.submit();

      expect(mockAuthFacade.login).toHaveBeenCalledWith({
        email: 'user+test@example.com',
        password: 'password123',
      });
    });

    it('should handle very long password', () => {
      const longPassword = 'a'.repeat(100);
      component.form.patchValue({
        email: 'test@example.com',
        password: longPassword,
      });
      component.submit();

      expect(mockAuthFacade.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: longPassword,
      });
    });

    it('should handle multiple submit calls', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.submit();
      component.submit();
      component.submit();

      expect(mockAuthFacade.login).toHaveBeenCalledTimes(3);
    });

    it('should reject email without domain', () => {
      component.form.patchValue({
        email: 'test@',
        password: 'password123',
      });
      expect(component.form.valid).toBeFalsy();
    });

    it('should reject email without @', () => {
      component.form.patchValue({
        email: 'test.example.com',
        password: 'password123',
      });
      expect(component.form.valid).toBeFalsy();
    });
  });
});
