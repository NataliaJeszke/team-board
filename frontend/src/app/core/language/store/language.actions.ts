import { createAction, props } from '@ngrx/store';

import { Language } from '@core/models';

export const setLanguage = createAction('[Language] Set', props<{ lang: Language }>());
