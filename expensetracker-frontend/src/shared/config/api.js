export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/users/me',
  },
  CATEGORIES: {
    BASE: '/api/v1/categories',
    BY_ID: (id) => `/api/v1/categories/${id}`,
  },
  EXPENSES: {
    BASE: '/api/v1/expenses',
    BY_ID: (id) => `/api/v1/expenses/${id}`,
    RECEIPT: (id) => `/api/v1/expenses/${id}/receipt`,
  },
  TEAMS: {
    BASE: '/api/v1/teams',
    BY_ID: (id) => `/api/v1/teams/${id}`,
    MEMBERS: (id) => `/api/v1/teams/${id}/members`,
    MEMBER: (teamId, userId) => `/api/v1/teams/${teamId}/members/${userId}`,
    EXPENSES: (id) => `/api/v1/teams/${id}/expenses`,
    EXPENSE: (teamId, expenseId) => `/api/v1/teams/${teamId}/expenses/${expenseId}`,
    STATS: (id) => `/api/v1/teams/${id}/stats`,
    ANALYTICS: (id) => `/api/v1/teams/${id}/analytics`,
  },
  STATS: {
    BASE: '/api/v1/stats',
    TIME_SERIES: '/api/v1/stats/time-series',
  },
  EXPORT: {
    EXPENSES_CSV: '/api/v1/export/expenses/csv',
    EXPENSES_PDF: '/api/v1/export/expenses/pdf',
    TEAM_EXPENSES_CSV: (teamId) => `/api/v1/export/teams/${teamId}/expenses/csv`,
    TEAM_EXPENSES_PDF: (teamId) => `/api/v1/export/teams/${teamId}/expenses/pdf`,
  },
};

