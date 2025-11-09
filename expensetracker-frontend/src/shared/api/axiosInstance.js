import axios from "axios";
import {
  getActiveAccount,
  updateActiveAccountTokens,
  getAuthToken,
  isTokenExpired,
  isTokenExpiringSoon,
  logger,
  retryRequest,
  defaultRetryConfig,
} from "@shared/lib";
import { env, API_ENDPOINTS } from "@shared/config";

export const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
});

const axiosRefresh = axios.create({
  baseURL: env.API_BASE_URL,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const activeAccount = getActiveAccount();
    const refreshToken = activeAccount?.refreshToken || localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const { data } = await axiosRefresh.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });

    const newAccessToken = data.data.accessToken;
    const newRefreshToken = data.data.refreshToken;

    const updated = updateActiveAccountTokens(newAccessToken, newRefreshToken);

    if (!updated) {
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    onTokenRefreshed(newAccessToken);
    isRefreshing = false;

    return newAccessToken;
  } catch (error) {
    isRefreshing = false;
    refreshSubscribers = [];
    logger.error("Refresh token expired, logging out...", error);
    localStorage.clear();
    window.location.href = "/login";
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = getAuthToken();

    if (token && isTokenExpiringSoon(token, env.TOKEN_REFRESH_BUFFER_MINUTES)) {
      try {
        token = await refreshAccessToken();
      } catch (error) {
      }
    }

    if (!config.headers.Authorization && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (!originalRequest._retry && !originalRequest._skipRetry) {
      const shouldRetry = error.response?.status >= 500 || 
                         error.response?.status === 408 || 
                         error.response?.status === 429 ||
                         !error.response;

      if (shouldRetry) {
        originalRequest._skipRetry = true;
        try {
          return await retryRequest(
            () => axiosInstance(originalRequest),
            defaultRetryConfig
          );
        } catch (retryError) {
          logger.error("Request failed after retries:", retryError);
        }
      }
    }

    return Promise.reject(error);
  }
);

let tokenRefreshInterval = null;

const startTokenRefreshInterval = () => {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
  }

  tokenRefreshInterval = setInterval(async () => {
    const token = getAuthToken();

    if (token) {
      if (isTokenExpired(token) || isTokenExpiringSoon(token, env.TOKEN_CHECK_INTERVAL_MINUTES)) {
        try {
          await refreshAccessToken();
        } catch (error) {
        }
      }
    }
  }, env.TOKEN_CHECK_INTERVAL_MINUTES * 60 * 1000);
};

if (typeof window !== "undefined") {
  startTokenRefreshInterval();
}