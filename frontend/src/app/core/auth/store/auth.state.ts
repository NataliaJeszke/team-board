import { User } from '@core/models';

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  initialized: false,
};
