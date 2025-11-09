import { useState } from 'react';
import { teamExportApi } from './api';
import { logger } from '@shared/lib/logger';

export const useTeamExpenseExport = () => {
  const [exporting, setExporting] = useState(null);
  const [error, setError] = useState(null);

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const exportExpenses = async (teamId, format) => {
    setExporting(format);
    setError(null);

    try {
      let blob;
      let fileName;

      if (format === 'csv') {
        blob = await teamExportApi.exportToCSV(teamId);
        fileName = `team_${teamId}_expenses_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (format === 'pdf') {
        blob = await teamExportApi.exportToPDF(teamId);
        fileName = `team_${teamId}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      }

      downloadFile(blob, fileName);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to export to ${format.toUpperCase()}`;
      setError(errorMessage);
      logger.error('Export failed:', err);
      return { success: false, error: errorMessage };
    } finally {
      setExporting(null);
    }
  };

  const clearError = () => setError(null);

  return {
    exportExpenses,
    exporting,
    error,
    clearError
  };
};