import type { User as PublicUser, UserDictionary } from '@team-board/shared-models';

// Re-export public types
export type { UserDictionary };

// Internal user with password (for auth)
export interface User extends PublicUser {
  password: string;
}
