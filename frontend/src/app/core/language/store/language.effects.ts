import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { setLanguage } from './language.actions';

@Injectable()
export class LanguageEffects {
    private actions = inject(Actions);
    private translate = inject(TranslateService);
  
    setLang$ = createEffect(
      () =>
        this.actions.pipe(
          ofType(setLanguage),
          tap(({ lang }) => {
            localStorage.setItem('lang', lang);
            this.translate.use(lang);
          })
        ),
      { dispatch: false }
    );
  
    initLang$ = createEffect(() => {
      const savedLang = (localStorage.getItem('lang') as 'pl' | 'en') ?? 'pl';
      return of(setLanguage({ lang: savedLang }));
    });
  }
