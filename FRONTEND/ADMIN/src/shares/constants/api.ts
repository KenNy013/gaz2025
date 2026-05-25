
export const API_ROUTES = {
  ADMIN: {
    LOGIN: '/api/admin/login',
    LOGOUT: '/api/admin/logout',
    APPLICATIONS: '/api/admin/applications',
    ME: '/api/admin/me',
    INQUIRIES: '/api/admin/inquiries',
    UPDATE_STATUS: (id: string) => `/api/admin/applications/${id}`,
    DELETE:  (id: string) => `/api/admin/applications/${id}`,
    PATCH: (id: string) => `/api/admin/applications/${id}`,

  },
  CLIENT: {
    CREATE_APP: '/api/client/application',
    GET_STATUS: (plate: string) => `/api/client/status/${plate}`,
    APPLICATIONS: '/api/client/application',
    INQUIRIES: 'api/client/inquiries',
  }
} as const;


export const AppStatus = {
  WAITING: 'WAITING',
  ACCEPTED: 'ACCEPTED',
  READY: 'READY',
} as const;

export type AppStatus = typeof AppStatus[keyof typeof AppStatus];

export const STATUS_LABELS: Record<AppStatus, { label: string, color: string }> = {
  [AppStatus.WAITING]: { label: 'Ожидание', color: 'orange' },
  [AppStatus.ACCEPTED]: { label: 'В работе', color: 'blue' },
  [AppStatus.READY]: { label: 'Готово', color: 'green' },
};
