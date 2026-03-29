import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Language } from '@core/models';
import { DEFAULT_LANGUAGE } from '@core/language/constants/language.constants';
import { PrimeNGTranslationService } from '@core/language/services/primeng-translation/primeng-translation.service';

import { setLanguage } from './language.actions';

@Injectable()
export class LanguageEffects {
    private actions = inject(Actions);
    private translate = inject(TranslateService);
    private primeNGTranslation = inject(PrimeNGTranslationService);

    setLang$ = createEffect(
      () =>
        this.actions.pipe(
          ofType(setLanguage),
          switchMap(({ lang }) =>
            this.translate.use(lang).pipe(
              tap(() => {
                localStorage.setItem('lang', lang);
                this.primeNGTranslation.setLanguage(lang);
                console.log('[LanguageEffects] Language changed to:', lang);
              }),
              catchError((error) => {
                console.error('[LanguageEffects] Failed to switch language:', error);
                return this.translate.use(DEFAULT_LANGUAGE).pipe(
                  tap(() => {
                    localStorage.setItem('lang', DEFAULT_LANGUAGE);
                    this.primeNGTranslation.setLanguage(DEFAULT_LANGUAGE);
                    console.warn('[LanguageEffects] Switched to default language after error');
                  })
                );
              })
            )
          )
        ),
      { dispatch: false }
    );

    initLang$ = createEffect(() => {
      const savedLang = (localStorage.getItem('lang') as Language) ?? DEFAULT_LANGUAGE;
      return of(setLanguage({ lang: savedLang }));
    });
  }
