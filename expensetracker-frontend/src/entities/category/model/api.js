import { axiosInstance } from "../../../shared/api/axiosInstance";

export const categoryApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/api/v1/categories");
    return data.data || [];
  },

  create: async (category) => {
    const { data } = await axiosInstance.post("/api/v1/categories", category);
    return data.data;
  },
};
