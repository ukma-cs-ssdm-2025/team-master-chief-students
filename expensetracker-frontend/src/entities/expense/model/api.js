// src/entities/expense/model/api.js
import { axiosInstance } from "../../../shared/api/axiosInstance";

export const expenseApi = {
  getAll: async (params = {}) => {
    const { cursor, limit = 20 } = params;
    const queryParams = new URLSearchParams();

    if (cursor) queryParams.append('cursor', cursor);
    queryParams.append('limit', limit.toString());

    const { data } = await axiosInstance.get(`/api/v1/expenses?${queryParams.toString()}`);
    return data.data || { items: [], hasNext: false, nextCursor: null };
  },

  create: async (expense) => {
    const { data } = await axiosInstance.post("/api/v1/expenses", expense);
    return data.data;
  },

  update: async (id, expense) => {
    const { data } = await axiosInstance.put(`/api/v1/expenses/${id}`, expense);
    return data.data;
  },

  delete: async (id) => {
    await axiosInstance.delete(`/api/v1/expenses/${id}`);
  },

  getReceipt: async (expenseId) => {
    const { data: blob } = await axiosInstance.get(
      `/api/v1/expenses/${expenseId}/receipt`,
      {
        responseType: 'blob',
      }
    );

    return URL.createObjectURL(blob);
  },

  uploadReceipt: async (expenseId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosInstance.post(
      `/api/v1/expenses/${expenseId}/receipt`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data;
  },

  deleteReceipt: async (expenseId) => {
    const { data } = await axiosInstance.delete(`/api/v1/expenses/${expenseId}/receipt`);
    return data.data;
  },
};