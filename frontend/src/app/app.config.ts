import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

import { API_CONFIG } from '@core/api/config/tokens/api-config.token';
import { authInterceptor } from '@core/api/config/interceptors/auth/auth.interceptor';
import { apiPrefixInterceptor } from '@core/api/config/interceptors/api-prefix/api-prefix.interceptor';

import { AuthEffects } from '@core/auth/store/auth.effects';
import { authReducer } from '@core/auth/store/auth.reducer';
import { AuthInitService } from '@core/auth/services/auth-init/auth-init.service';
import { languageReducer } from '@core/language/store/language.reducer';
import { LanguageEffects } from '@core/language/store/language.effects';
import { TranslationInitService } from '@core/language/services/translation-init/translation-init.service';

import { TasksEffects } from '@feature/tasks/store/tasks/tasks.effects';
import { tasksReducer } from '@feature/tasks/store/tasks/tasks.reducer';

import { environment } from './environments/environment';
import MyBlueTheme from '../theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiPrefixInterceptor, authInterceptor])),
    { provide: API_CONFIG, useValue: { baseUrl: environment.apiBaseUrl } },
    provideAppInitializer(() => {
      const translationInitService = inject(TranslationInitService);
      return firstValueFrom(translationInitService.initializeTranslations());
    }),
    provideAppInitializer(() => {
      const authInitService = inject(AuthInitService);
      return firstValueFrom(authInitService.initializeAuth());
    }),
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
    provideStore({ auth: authReducer, language: languageReducer, tasks: tasksReducer }),
    provideEffects([AuthEffects, LanguageEffects, TasksEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
