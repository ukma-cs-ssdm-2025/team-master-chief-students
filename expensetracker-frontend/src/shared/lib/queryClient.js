import { QueryClient } from '@tanstack/react-query';
import { logger } from './logger';
import { env } from '@shared/config/env';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.response?.status) {
          const status = error.response.status;
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false;
          }
        }
        return failureCount < env.QUERY_RETRY_COUNT;
      },
      retryDelay: (attemptIndex) => Math.min(env.QUERY_RETRY_DELAY_BASE_MS * 2 ** attemptIndex, env.QUERY_RETRY_DELAY_MAX_MS),
      staleTime: env.QUERY_STALE_TIME_MS,
      gcTime: env.QUERY_GC_TIME_MS,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      onError: (error) => {
        logger.error('Query error:', error);
      },
    },
    mutations: {
      retry: false,
      onError: (error) => {
        logger.error('Mutation error:', error);
      },
    },
  },
});