import { User } from '@core/models';

export interface AuthResponse {
  access_token: string;
  user: User;
}
