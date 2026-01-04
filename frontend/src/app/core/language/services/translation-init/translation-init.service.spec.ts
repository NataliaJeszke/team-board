import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MockInstance, MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { TranslationInitService } from './translation-init.service';
import { PrimeNGTranslationService } from '@core/language/services/primeng-translation/primeng-translation.service';
import { Language } from '@core/models';
import { DEFAULT_LANGUAGE } from '@core/language/constants/language.constants';

describe('TranslationInitService', () => {
  MockInstance.scope();

  let service: TranslationInitService;
  let translateSetDefaultLangMock: jest.Mock;
  let translateUseMock: jest.Mock;
  let primeNGInitializeTranslationsMock: jest.Mock;
  let localStorageGetItemMock: jest.Mock;
  let consoleLogMock: jest.SpyInstance;
  let consoleErrorMock: jest.SpyInstance;
  let consoleWarnMock: jest.SpyInstance;

  beforeEach(() => {
    translateSetDefaultLangMock = jest.fn();
    translateUseMock = jest.fn().mockReturnValue(of({}));
    primeNGInitializeTranslationsMock = jest.fn();
    localStorageGetItemMock = jest.fn();

    MockInstance(TranslateService, () => ({
      setDefaultLang: translateSetDefaultLangMock,
      use: translateUseMock,
    }));

    MockInstance(PrimeNGTranslationService, () => ({
      initializeTranslations: primeNGInitializeTranslationsMock,
    }));

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: localStorageGetItemMock,
      },
      writable: true,
    });

    consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

    TestBed.configureTestingModule({
      providers: [MockProvider(TranslateService), MockProvider(PrimeNGTranslationService), TranslationInitService],
    });

    service = TestBed.inject(TranslationInitService);
  });

  afterEach(() => {
    consoleLogMock.mockRestore();
    consoleErrorMock.mockRestore();
    consoleWarnMock.mockRestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeTranslations', () => {
    it('should set default language', (done) => {
      // Arrange
      localStorageGetItemMock.mockReturnValue(null);

      // Act
      service.initializeTranslations().subscribe(() => {
        // Assert
        expect(translateSetDefaultLangMock).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
        done();
      });
    });

    it('should load saved language from localStorage', (done) => {
      // Arrange
      const savedLanguage: Language = 'en';
      localStorageGetItemMock.mockReturnValue(savedLanguage);

      // Act
      service.initializeTranslations().subscribe(() => {
        // Assert
        expect(translateUseMock).toHaveBeenCalledWith(savedLanguage);
        done();
      });
    });

    it('should use default language when no saved language exists', (done) => {
      // Arrange
      localStorageGetItemMock.mockReturnValue(null);

      // Act
      service.initializeTranslations().subscribe(() => {
        // Assert
        expect(translateUseMock).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
        done();
      });
    });

    it('should use default language when saved language is invalid', (done) => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('invalid-lang');

      // Act
      service.initializeTranslations().subscribe(() => {
        // Assert
        expect(translateUseMock).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
        done();
      });
    });

    it('should initialize PrimeNG translations', (done) => {
      // Arrange
      const savedLanguage: Language = 'en';
      localStorageGetItemMock.mockReturnValue(savedLanguage);

      // Act
      service.initializeTranslations().subscribe(() => {
        // Assert
        expect(primeNGInitializeTranslationsMock).toHaveBeenCalledWith(savedLanguage);
        done();
      });
    });

    it('should return true when translations load successfully', (done) => {
      // Arrange
      localStorageGetItemMock.mockReturnValue(null);

      // Act
      service.initializeTranslations().subscribe(result => {
        // Assert
        expect(result).toBe(true);
        done();
      });
    });

    it('should load fallback translations when primary translation fails', (done) => {
      // Arrange
      localStorageGetItemMock.mockReturnValue('en');
      translateUseMock
        .mockReturnValueOnce(of({}))
        .mockReturnValueOnce(throwError(() => new Error('Failed')))
        .mockReturnValueOnce(of({}));

      // Act
      service.initializeTranslations().subscribe(result => {
        // Assert
        expect(consoleWarnMock).toHaveBeenCalledWith(
          '[TranslationInit] Loading fallback translations:',
          DEFAULT_LANGUAGE
        );
        expect(result).toBe(true);
        done();
      });
    });

    it('should log success message when translations loaded', (done) => {
      // Arrange
      localStorageGetItemMock.mockReturnValue(null);

      // Act
      service.initializeTranslations().subscribe(() => {
        // Assert
        expect(consoleLogMock).toHaveBeenCalledWith(
          '[TranslationInit] Translations loaded successfully:',
          DEFAULT_LANGUAGE
        );
        done();
      });
    });
  });
});
