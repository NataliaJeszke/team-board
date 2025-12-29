import { LANGUAGES } from "@core/language/constants/language.constants";

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];