const buildResourceEndpoint = (base: string) => ({
  BASE: base,
  BY_ID: (id: number | string) => `${base}/${id}`,
});

export const API_ENDPOINTS = {
  AUTH: {
    BASE: '/auth',
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  TASKS: {
    ...buildResourceEndpoint('/tasks'),
    STATUS: (id: number) => `/tasks/${id}/status`,
  },
  USERS: {
    ...buildResourceEndpoint('/users'),
    DICTIONARY: '/users/dictionary',
    PROFILE: (id: number) => `/users/${id}/profile`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
