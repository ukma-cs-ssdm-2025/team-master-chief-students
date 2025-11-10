import { axiosInstance } from "@shared/api/axiosInstance";

export const statsApi = {
  getStats: async () => {
    const { data } = await axiosInstance.get("/api/v1/expenses/filter-service/stats");
    return data.data;
  },

  getTimeSeriesStats: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.category) queryParams.append('category', params.category);
    if (params.categoryMatch) queryParams.append('categoryMatch', params.categoryMatch);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    if (params.minAmount !== undefined) queryParams.append('minAmount', params.minAmount);
    if (params.maxAmount !== undefined) queryParams.append('maxAmount', params.maxAmount);
    if (params.hasReceipt !== undefined) queryParams.append('hasReceipt', params.hasReceipt);
    if (params.teamId) queryParams.append('teamId', params.teamId);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/api/v1/expenses/filter-service/time-series-stats${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await axiosInstance.get(url);
    return data.data;
  },

  getCategoryStats: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.category) queryParams.append('category', params.category);
    if (params.categoryMatch) queryParams.append('categoryMatch', params.categoryMatch);
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);
    if (params.minAmount !== undefined) queryParams.append('minAmount', params.minAmount);
    if (params.maxAmount !== undefined) queryParams.append('maxAmount', params.maxAmount);
    if (params.hasReceipt !== undefined) queryParams.append('hasReceipt', params.hasReceipt);
    if (params.teamId) queryParams.append('teamId', params.teamId);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/api/v1/expenses/filter-service/category-pie-stats${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await axiosInstance.get(url);
    return data.data;
  },
};