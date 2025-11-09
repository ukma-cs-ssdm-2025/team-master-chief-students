import React from 'react';
import { useTeamExpenseExport } from '../model/hooks';
import { Icon } from '@shared/ui/Icon';
import { useToast } from '@shared/hooks/useToast';
import { Toast } from '@shared/ui/Toast';

export const TeamExpenseExport = ({ teamId, userRole }) => {
  const { exportExpenses, exporting, error } = useTeamExpenseExport();
  const { toast, showError, hideToast } = useToast();

  const canExport = userRole === 'OWNER' || userRole === 'ADMIN';

  const handleExport = async (format) => {
    if (!canExport) {
      showError('Only team OWNER and ADMIN can export reports');
      return;
    }
    await exportExpenses(teamId, format);
  };

  if (!canExport) {
    return (
      <div className="bg-gray-50 rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <Icon name="information" className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Export Restricted</h3>
            <p className="text-sm">Only OWNER and ADMIN can export team reports</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Export Team Expenses</h2>
        <Icon name="download" className="w-6 h-6 text-blue-500" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <Icon name="exclamation" className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">Your role:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          userRole === 'OWNER'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {userRole}
        </span>
        <span className="text-xs text-green-600 flex items-center gap-1">
          <Icon name="check" className="w-4 h-4" />
          Can export
        </span>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleExport('csv')}
          disabled={exporting}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {exporting === 'csv' ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Icon name="file" className="w-5 h-5" />
              <span>Export to CSV</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleExport('pdf')}
          disabled={exporting}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {exporting === 'pdf' ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Icon name="file" className="w-5 h-5" />
              <span>Export to PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Export Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Export Information</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>CSV format: Can be opened in Excel, Google Sheets, or any spreadsheet software</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>PDF format: Formatted team report ready for printing or sharing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Exports include all team expenses with full details</span>
          </li>
        </ul>
      </div>

      <Toast
        isOpen={toast.isOpen}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
};
