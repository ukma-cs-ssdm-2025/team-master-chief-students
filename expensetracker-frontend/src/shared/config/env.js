export const env = {
  API_BASE_URL: import.meta.env.DEV
      ? 'http://localhost:8080/api/v1'
      : '/api/v1',
  TOKEN_REFRESH_BUFFER_MINUTES: Number(import.meta.env.VITE_TOKEN_REFRESH_BUFFER_MINUTES) || 2,
  TOKEN_CHECK_INTERVAL_MINUTES: Number(import.meta.env.VITE_TOKEN_CHECK_INTERVAL_MINUTES) || 5,
  TOAST_DURATION_MS: Number(import.meta.env.VITE_TOAST_DURATION_MS) || 3000,
  DEBOUNCE_DELAY_MS: Number(import.meta.env.VITE_DEBOUNCE_DELAY_MS) || 500,
  LOGIN_REDIRECT_DELAY_MS: Number(import.meta.env.VITE_LOGIN_REDIRECT_DELAY_MS) || 1000,
  REGISTER_REDIRECT_DELAY_MS: Number(import.meta.env.VITE_REGISTER_REDIRECT_DELAY_MS) || 1500,
  QUERY_RETRY_COUNT: Number(import.meta.env.VITE_QUERY_RETRY_COUNT) || 3,
  QUERY_RETRY_DELAY_BASE_MS: Number(import.meta.env.VITE_QUERY_RETRY_DELAY_BASE_MS) || 1000,
  QUERY_RETRY_DELAY_MAX_MS: Number(import.meta.env.VITE_QUERY_RETRY_DELAY_MAX_MS) || 30000,
  QUERY_STALE_TIME_MS: Number(import.meta.env.VITE_QUERY_STALE_TIME_MS) || 5 * 60 * 1000,
  QUERY_GC_TIME_MS: Number(import.meta.env.VITE_QUERY_GC_TIME_MS) || 10 * 60 * 1000,
};

