import { axiosInstance } from '@shared/api/axiosInstance';

export const exportApi = {
  exportToCSV: async () => {
    const response = await axiosInstance.get('/api/v1/expenses/export/csv', {
      responseType: 'blob'
    });
    return response.data;
  },

  exportToPDF: async () => {
    const response = await axiosInstance.get('/api/v1/expenses/export/pdf', {
      responseType: 'blob'
    });
    return response.data;
  }
};