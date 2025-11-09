import { axiosInstance } from "../../../shared/api/axiosInstance";

export const statsApi = {
  getStats: async () => {
    const { data } = await axiosInstance.get("/api/v1/expenses/filter-service/stats");
    return data.data;
  }
};