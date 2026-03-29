export interface User {
  id: number;
  email: string;
  name: string;
}

export interface UserDictionary {
  [id: number]: {
    id: number;
    name: string;
  };
}
