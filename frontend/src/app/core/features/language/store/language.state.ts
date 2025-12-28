import { Language } from "@core/models";
import { DEFAULT_LANGUAGE } from "@core/constants";

export interface LanguageState {
    lang: Language;
  }
  
  export const initialLanguageState: LanguageState = {
    lang: DEFAULT_LANGUAGE,
  };