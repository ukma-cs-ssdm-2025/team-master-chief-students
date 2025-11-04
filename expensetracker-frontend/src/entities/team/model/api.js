import { axiosInstance } from "../../../shared/api/axiosInstance";

export const teamApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/api/v1/teams");
    return data.data || [];
  },

  getById: async (teamId) => {
    const { data } = await axiosInstance.get(`/api/v1/teams/${teamId}`);
    return data.data;
  },

  create: async (teamData) => {
    const { data } = await axiosInstance.post("/api/v1/teams", teamData);
    return data.data;
  },

  addMember: async (teamId, memberData) => {
    const { data } = await axiosInstance.post(
      `/api/v1/teams/${teamId}/members`,
      memberData
    );
    return data.data;
  },

  changeMemberRole: async (teamId, userId, role) => {
    const { data } = await axiosInstance.patch(
      `/api/v1/teams/${teamId}/members/${userId}?role=${role}`
    );
    return data.data;
  },

  removeMember: async (teamId, userId) => {
    await axiosInstance.delete(`/api/v1/teams/${teamId}/members/${userId}`);
  },

  getExpenses: async (teamId, params = {}) => {
    const { cursor, limit = 20 } = params;
    const queryParams = new URLSearchParams();

    if (cursor) queryParams.append('cursor', cursor);
    queryParams.append('limit', limit.toString());

    const { data } = await axiosInstance.get(
      `/api/v1/teams/${teamId}/expenses?${queryParams.toString()}`
    );
    return data.data;
  },

  createExpense: async (teamId, expenseData) => {
    const { data } = await axiosInstance.post(
      `/api/v1/teams/${teamId}/expenses`,
      expenseData
    );
    return data.data;
  },

  updateExpense: async (expenseId, expenseData) => {
    const { data } = await axiosInstance.put(`/api/v1/expenses/${expenseId}`, expense);
    return data.data;
  },

  deleteExpense: async (expenseId) => {
    await axiosInstance.delete(
      `/api/v1/expenses/${expenseId}`
    );
  },

  shareExpense: async (expenseId, shareData) => {
    const { data } = await axiosInstance.post(
      `/api/v1/expenses/${expenseId}/share`,
      shareData
    );
    return data.data;
  },
};