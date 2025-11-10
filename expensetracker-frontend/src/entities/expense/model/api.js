import { axiosInstance } from "@shared/api/axiosInstance";
import { API_ENDPOINTS } from "@shared/config";

export const expenseApi = {
  getAll: async (params = {}) => {
    const { cursor, limit = 20, ...filters } = params;
    const queryParams = new URLSearchParams();

    if (cursor) queryParams.append('cursor', cursor);
    queryParams.append('limit', limit.toString());

    if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.categoryMatch) queryParams.append('categoryMatch', filters.categoryMatch);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.minAmount !== undefined) queryParams.append('minAmount', filters.minAmount);
    if (filters.maxAmount !== undefined) queryParams.append('maxAmount', filters.maxAmount);
    if (filters.hasReceipt !== undefined) queryParams.append('hasReceipt', filters.hasReceipt);
    if (filters.search) queryParams.append('search', filters.search);

    const { data } = await axiosInstance.get(`${API_ENDPOINTS.EXPENSES.BASE}/filter-service/items?${queryParams.toString()}`);
    return data.data || { items: [], hasNext: false, nextCursor: null };
  },

  create: async (expense) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.EXPENSES.BASE, expense);
    return data.data;
  },

  update: async (id, expense) => {
    const { data } = await axiosInstance.put(API_ENDPOINTS.EXPENSES.BY_ID(id), expense);
    return data.data;
  },

  delete: async (id) => {
    await axiosInstance.delete(API_ENDPOINTS.EXPENSES.BY_ID(id));
  },

  getReceipt: async (expenseId) => {
    const { data: blob } = await axiosInstance.get(
      API_ENDPOINTS.EXPENSES.RECEIPT(expenseId),
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
      API_ENDPOINTS.EXPENSES.RECEIPT(expenseId),
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
    const { data } = await axiosInstance.delete(API_ENDPOINTS.EXPENSES.RECEIPT(expenseId));
    return data.data;
  },
};