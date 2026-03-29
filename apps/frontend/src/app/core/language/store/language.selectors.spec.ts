/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  selectLanguageState,
  selectCurrentLanguage,
} from './language.selectors';
import { LanguageState } from './language.state';

describe('Language Selectors', () => {
  const initialLanguageState: LanguageState = {
    lang: 'pl',
  };

  const mockRootState = {
    language: initialLanguageState,
  };

  describe('selectLanguageState', () => {
    it('should select language feature state', () => {
      const result = selectLanguageState(mockRootState as any);

      expect(result).toEqual(initialLanguageState);
    });
  });

  describe('selectCurrentLanguage', () => {
    it('should select current language', () => {
      const result = selectCurrentLanguage.projector(initialLanguageState);

      expect(result).toBe('pl');
    });
  });
});