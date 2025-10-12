import { axiosInstance } from "../../../shared/api/axiosInstance";

export const authApi = {
  login: async (email, password) => {
    const { data } = await axiosInstance.post("/api/v1/auth/login", { email, password });
    return data;
  },
};
