import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, timeout, tap } from 'rxjs/operators';

import { Language } from '@core/models';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@core/language/constants/language.constants';
import { PrimeNGTranslationService } from '@core/language/services/primeng-translation/primeng-translation.service';

@Injectable({ providedIn: 'root' })
export class TranslationInitService {
  private readonly translate = inject(TranslateService);
  private readonly primeNGTranslation = inject(PrimeNGTranslationService);

  private readonly TRANSLATION_LOAD_TIMEOUT = 10000;

  initializeTranslations(): Observable<boolean> {
    const savedLanguage = this.getSavedLanguage();

    this.translate.setDefaultLang(DEFAULT_LANGUAGE);

    return this.preloadTranslations(savedLanguage).pipe(
      tap(() => {
        this.primeNGTranslation.initializeTranslations(savedLanguage);
      }),
      map(() => {
        console.log('[TranslationInit] Translations loaded successfully:', savedLanguage);
        return true;
      }),
      catchError((error) => {
        console.error('[TranslationInit] Failed to load translations:', error);
        return this.loadFallbackTranslations();
      })
    );
  }

  private preloadTranslations(language: Language): Observable<void> {
    if (language === DEFAULT_LANGUAGE) {
      return this.translate.use(language).pipe(
        timeout(this.TRANSLATION_LOAD_TIMEOUT),
        map(() => void 0),
        catchError((error) => {
          console.error(`[TranslationInit] Failed to load default language (${DEFAULT_LANGUAGE}):`, error);
          throw error;
        })
      );
    }

    return this.translate.use(DEFAULT_LANGUAGE).pipe(
      timeout(this.TRANSLATION_LOAD_TIMEOUT),
      catchError((error) => {
        console.error(`[TranslationInit] Failed to load fallback language (${DEFAULT_LANGUAGE}):`, error);
        return of({});
      }),
      switchMap(() =>
        this.translate.use(language).pipe(
          timeout(this.TRANSLATION_LOAD_TIMEOUT),
          map(() => void 0),
          catchError((error) => {
            console.error(`[TranslationInit] Failed to load language (${language}):`, error);
            throw error;
          })
        )
      )
    );
  }

  private loadFallbackTranslations(): Observable<boolean> {
    console.warn('[TranslationInit] Loading fallback translations:', DEFAULT_LANGUAGE);

    return this.translate.use(DEFAULT_LANGUAGE).pipe(
      timeout(this.TRANSLATION_LOAD_TIMEOUT),
      tap(() => {
        this.primeNGTranslation.initializeTranslations(DEFAULT_LANGUAGE);
      }),
      map(() => {
        console.log('[TranslationInit] Fallback translations loaded successfully');
        return true;
      }),
      catchError((error) => {
        console.error('[TranslationInit] Critical error: Failed to load fallback translations:', error);
        return of(false);
      })
    );
  }

  private getSavedLanguage(): Language {
    const savedLang = localStorage.getItem('lang') as Language;

    if (savedLang && Object.values(LANGUAGES).includes(savedLang)) {
      return savedLang;
    }

    return DEFAULT_LANGUAGE;
  }
}
