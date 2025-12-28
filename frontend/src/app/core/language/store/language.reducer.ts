import { createReducer, on } from '@ngrx/store';

import { setLanguage } from './language.actions';

export interface LanguageState {
  lang: 'pl' | 'en';
}

export const initialState: LanguageState = {
  lang: 'pl',
};

export const languageReducer = createReducer(
  initialState,
  on(setLanguage, (state, { lang }) => ({ ...state, lang }))
);
