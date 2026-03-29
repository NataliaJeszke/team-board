import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';

import { Language } from '@core/models';
import { DEFAULT_LANGUAGE } from '@core/language/constants/language.constants';

import { selectCurrentLanguage } from './store/language.selectors';
import { setLanguage } from './store/language.actions';


@Injectable({ providedIn: 'root' })
export class LanguageFacade {
  private readonly store = inject(Store);

  readonly currentLanguage: Signal<Language> = toSignal(
    this.store.select(selectCurrentLanguage),
    { initialValue: DEFAULT_LANGUAGE }
  );

  setLanguage(lang: Language): void {
    this.store.dispatch(setLanguage({ lang }));
  }
}