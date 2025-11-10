import { axiosInstance } from "@shared/api/axiosInstance";
import { API_ENDPOINTS } from "@shared/config";

export const login = async (data) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

export const register = async (data) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
  return response.data;
};
