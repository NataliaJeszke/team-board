import { TestBed } from '@angular/core/testing';
import { PrimeNG } from 'primeng/config';
import { MockInstance, MockProvider } from 'ng-mocks';

import { PrimeNGTranslationService } from './primeng-translation.service';
import { Language } from '@core/models';
import { PRIMENG_TRANSLATIONS } from '@core/language/constants/primeng-translations.constants';

describe('PrimeNGTranslationService', () => {
  MockInstance.scope();

  let service: PrimeNGTranslationService;
  let primeNGSetTranslationMock: jest.Mock;
  let consoleWarnMock: jest.SpyInstance;

  beforeEach(() => {
    primeNGSetTranslationMock = jest.fn();

    MockInstance(PrimeNG, () => ({
      setTranslation: primeNGSetTranslationMock,
    }));

    consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

    TestBed.configureTestingModule({
      providers: [MockProvider(PrimeNG), PrimeNGTranslationService],
    });

    service = TestBed.inject(PrimeNGTranslationService);
  });

  afterEach(() => {
    consoleWarnMock.mockRestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setLanguage', () => {
    it('should set translation for Polish language', () => {
      // Arrange
      const language: Language = 'pl';

      // Act
      service.setLanguage(language);

      // Assert
      expect(primeNGSetTranslationMock).toHaveBeenCalledWith(PRIMENG_TRANSLATIONS[language]);
    });

    it('should set translation for English language', () => {
      // Arrange
      const language: Language = 'en';

      // Act
      service.setLanguage(language);

      // Assert
      expect(primeNGSetTranslationMock).toHaveBeenCalledWith(PRIMENG_TRANSLATIONS[language]);
    });

    it('should log warning when translation not found for language', () => {
      // Arrange
      const language = 'fr' as Language;

      // Act
      service.setLanguage(language);

      // Assert
      expect(consoleWarnMock).toHaveBeenCalledWith(
        '[PrimeNGTranslation] No translations found for language:',
        language
      );
      expect(primeNGSetTranslationMock).not.toHaveBeenCalled();
    });
  });

  describe('initializeTranslations', () => {
    it('should call setLanguage with provided language', () => {
      // Arrange
      const language: Language = 'en';
      const setLanguageSpy = jest.spyOn(service, 'setLanguage');

      // Act
      service.initializeTranslations(language);

      // Assert
      expect(setLanguageSpy).toHaveBeenCalledWith(language);
    });
  });
});
