import { axiosInstance } from "@shared/api/axiosInstance";
import { API_ENDPOINTS } from "@shared/config";

export const categoryApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.BASE);
    return data.data || [];
  },

  create: async (category) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.BASE, category);
    return data.data;
  },
};
