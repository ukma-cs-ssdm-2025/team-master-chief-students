import axios from "axios";
import { getActiveAccount, updateActiveAccountTokens } from "../lib/multiAccountStorage";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

const axiosRefresh = axios.create({
  baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const activeAccount = getActiveAccount();
      const token = activeAccount?.accessToken || localStorage.getItem("accessToken");
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        const activeAccount = getActiveAccount();
        const refreshToken = activeAccount?.refreshToken || localStorage.getItem("refreshToken");
        
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axiosRefresh.post("/api/v1/auth/refresh", { refreshToken });

        const updated = updateActiveAccountTokens(
          data.data.accessToken,
          data.data.refreshToken
        );

        if (!updated) {
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired, logging out...");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);