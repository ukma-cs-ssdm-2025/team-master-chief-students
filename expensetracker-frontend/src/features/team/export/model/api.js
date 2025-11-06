import { axiosInstance } from '../../../../shared/api/axiosInstance';

export const teamExportApi = {
  exportToCSV: async (teamId) => {
    const response = await axiosInstance.get(`/api/v1/teams/${teamId}/expenses/export/csv`, {
      responseType: 'blob'
    });
    return response.data;
  },

  exportToPDF: async (teamId) => {
    const response = await axiosInstance.get(`/api/v1/teams/${teamId}/expenses/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
};