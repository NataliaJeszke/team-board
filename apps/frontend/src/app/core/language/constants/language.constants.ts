import { Language } from "@core/models";

export const LANGUAGES = {
    PL: 'pl',
    EN: 'en',
  } as const;

  export const DEFAULT_LANGUAGE: Language = LANGUAGES.PL;