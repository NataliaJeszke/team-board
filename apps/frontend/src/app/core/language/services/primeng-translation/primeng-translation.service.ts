import { inject, Injectable } from '@angular/core';
import { PrimeNG } from 'primeng/config';

import { Language } from '@core/models';
import { PRIMENG_TRANSLATIONS } from '@core/language/constants/primeng-translations.constants';

@Injectable({ providedIn: 'root' })
export class PrimeNGTranslationService {
  private readonly primeNG = inject(PrimeNG);

  setLanguage(language: Language): void {
    const translationData = PRIMENG_TRANSLATIONS[language];

    if (translationData) {
      this.primeNG.setTranslation(translationData);
    } else {
      console.warn('[PrimeNGTranslation] No translations found for language:', language);
    }
  }

  initializeTranslations(language: Language): void {
    this.setLanguage(language);
  }
}
