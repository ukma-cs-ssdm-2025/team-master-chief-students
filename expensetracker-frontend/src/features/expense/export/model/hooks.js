import { useState } from 'react';
import { exportApi } from './api';

export const useExpenseExport = () => {
  const [exporting, setExporting] = useState(false);
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

  const exportExpenses = async () => {
    setExporting(true);
    setError(null);

    try {
      const blob = await exportApi.exportToCSV();
      const fileName = `expenses_export_${new Date().toISOString().split('T')[0]}.csv`;
      downloadFile(blob, fileName);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to export expenses';
      setError(errorMessage);
      console.error('Export failed:', err);
      return { success: false, error: errorMessage };
    } finally {
      setExporting(false);
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
