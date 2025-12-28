import { LANGUAGES } from "@core/constants";

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];