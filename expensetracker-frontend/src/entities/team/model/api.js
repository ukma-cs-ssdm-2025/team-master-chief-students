// src/entities/team/model/api.js
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

  delete: async (teamId) => {
    await axiosInstance.delete(`/api/v1/teams/${teamId}`);
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
    const { data } = await axiosInstance.put(
      `/api/v1/expenses/${expenseId}`,
      expenseData
    );
    return data.data;
  },

  deleteExpense: async (expenseId) => {
    await axiosInstance.delete(`/api/v1/expenses/${expenseId}`);
  },

  shareExpense: async (expenseId, shareData) => {
    const { data } = await axiosInstance.post(
      `/api/v1/expenses/${expenseId}/share`,
      shareData
    );
    return data.data;
  },

  getTimeSeriesStats: async (teamId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.category) queryParams.append('category', params.category);
    if (params.categoryMatch) queryParams.append('categoryMatch', params.categoryMatch);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    if (params.minAmount !== undefined) queryParams.append('minAmount', params.minAmount);
    if (params.maxAmount !== undefined) queryParams.append('maxAmount', params.maxAmount);
    if (params.hasReceipt !== undefined) queryParams.append('hasReceipt', params.hasReceipt);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/api/v1/teams/${teamId}/expenses/time-series-stats${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await axiosInstance.get(url);
    return data.data;
  },

  getCategoryStats: async (teamId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.category) queryParams.append('category', params.category);
    if (params.categoryMatch) queryParams.append('categoryMatch', params.categoryMatch);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    if (params.minAmount !== undefined) queryParams.append('minAmount', params.minAmount);
    if (params.maxAmount !== undefined) queryParams.append('maxAmount', params.maxAmount);
    if (params.hasReceipt !== undefined) queryParams.append('hasReceipt', params.hasReceipt);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/api/v1/teams/${teamId}/expenses/category-pie-stats${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await axiosInstance.get(url);
    return data.data;
  },
};