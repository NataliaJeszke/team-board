import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

import { authInterceptor } from '@core/api/interceptors/auth/auth.interceptor';

import { AuthEffects } from '@core/auth/store/auth.effects';
import { authReducer } from '@core/auth/store/auth.reducer';
import { languageReducer } from '@core/language/store/language.reducer';
import { LanguageEffects } from '@core/language/store/language.effects';

import MyBlueTheme from '../theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'pl',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
        },
      })
    ),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json',
    }),
    providePrimeNG({
      theme: {
        preset: MyBlueTheme,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: false,
        },
      },
      ripple: true,
      overlayAppendTo: 'body',
    }),
    provideStore({ auth: authReducer, language: languageReducer }),
    provideEffects([AuthEffects, LanguageEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
