import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { LoginRequest, RegisterRequest, User } from '@core/models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    login: props<{ credentials: LoginRequest }>(),
    loginSuccess: props<{ token: string; user: User }>(),
    loginFailure: props<{ error: string }>(),

    register: props<{ data: RegisterRequest }>(),
    registerSuccess: props<{ token: string; user: User }>(),
    registerFailure: props<{ error: string }>(),

    initAuth: emptyProps(),
    initAuthSuccess: props<{ token: string; user: User }>(),
    initAuthFailure: emptyProps(),

    loadProfile: emptyProps(),
    loadProfileSuccess: props<{ user: User }>(),
    loadProfileFailure: props<{ error: string }>(),

    logout: emptyProps(),
  },
});