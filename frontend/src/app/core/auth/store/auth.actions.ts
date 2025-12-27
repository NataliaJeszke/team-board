import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AuthResponse } from '../../api/models/auth/auth.model';

import { LoginRequest, RegisterRequest } from '../../models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: string }>(),
    
    'Register': props<{ data: RegisterRequest }>(),
    'Register Success': props<{ response: AuthResponse }>(),
    'Register Failure': props<{ error: string }>(),
    
    'Logout': emptyProps(),
    'Logout Complete': emptyProps(),
  }
});