import { createReducer, on } from '@ngrx/store';

import { setLanguage } from './language.actions';
import { initialLanguageState } from './language.state';

export const languageReducer = createReducer(
  initialLanguageState,
  on(setLanguage, (state, { lang }) => ({ ...state, lang }))
);
