import { axiosInstance } from "@shared/api/axiosInstance";
import { API_ENDPOINTS } from "@shared/config";

export const teamApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TEAMS.BASE);
    return data.data || [];
  },

  getById: async (teamId) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TEAMS.BY_ID(teamId));
    return data.data;
  },

  create: async (teamData) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.TEAMS.BASE, teamData);
    return data.data;
  },

  delete: async (teamId) => {
    await axiosInstance.delete(API_ENDPOINTS.TEAMS.BY_ID(teamId));
  },

  addMember: async (teamId, memberData) => {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.TEAMS.MEMBERS(teamId),
      memberData
    );
    return data.data;
  },

  changeMemberRole: async (teamId, userId, role) => {
    const { data } = await axiosInstance.patch(
      `${API_ENDPOINTS.TEAMS.MEMBER(teamId, userId)}?role=${role}`
    );
    return data.data;
  },

  removeMember: async (teamId, userId) => {
    await axiosInstance.delete(API_ENDPOINTS.TEAMS.MEMBER(teamId, userId));
  },

  getExpenses: async (teamId, params = {}) => {
    const { cursor, limit = 20 } = params;
    const queryParams = new URLSearchParams();

    if (cursor) queryParams.append('cursor', cursor);
    queryParams.append('limit', limit.toString());

    const { data } = await axiosInstance.get(
      `${API_ENDPOINTS.TEAMS.EXPENSES(teamId)}?${queryParams.toString()}`
    );
    return data.data;
  },

  createExpense: async (teamId, expenseData) => {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.TEAMS.EXPENSES(teamId),
      expenseData
    );
    return data.data;
  },

  updateExpense: async (expenseId, expenseData) => {
    const { data } = await axiosInstance.put(
      API_ENDPOINTS.EXPENSES.BY_ID(expenseId),
      expenseData
    );
    return data.data;
  },

  deleteExpense: async (expenseId) => {
    await axiosInstance.delete(API_ENDPOINTS.EXPENSES.BY_ID(expenseId));
  },

  shareExpense: async (expenseId, shareData) => {
    const { data } = await axiosInstance.post(
      `${API_ENDPOINTS.EXPENSES.BY_ID(expenseId)}/share`,
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
    const url = `${API_ENDPOINTS.TEAMS.EXPENSES(teamId)}/time-series-stats${queryString ? `?${queryString}` : ''}`;
    
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
    const url = `${API_ENDPOINTS.TEAMS.EXPENSES(teamId)}/category-pie-stats${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await axiosInstance.get(url);
    return data.data;
  },
};