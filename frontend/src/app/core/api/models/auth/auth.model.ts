import { User } from '../../../models/user.model';

export interface AuthResponse {
  access_token: string;
  user: User;
}
