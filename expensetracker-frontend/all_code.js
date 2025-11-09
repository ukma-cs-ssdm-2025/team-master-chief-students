import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
export { ErrorBoundary } from "./ErrorBoundary.jsx";
// src/app/providers/index.jsx
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary";
import { CategoryProvider } from "../../entities/category/model/CategoryProvider.jsx";

export const AppProvider = ({ children }) => {
  return (
    <ErrorBoundary>
      <CategoryProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          {children}
        </BrowserRouter>
      </CategoryProvider>
    </ErrorBoundary>
  );
};
import { AuthPage } from "../../../pages/auth/AuthPage";

export const routes = [
  { path: "/login", element: <AuthPage /> },
];
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/auth/AuthPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { TeamsPage } from "../pages/teams/TeamsPage";
import { TeamDetailsPage } from "../pages/teams/TeamDetailsPage";
import { ProtectedRoute } from "../shared/ui/ProtectedRoute";
import { NotFoundPage } from "../pages/not-found/NotFoundPage";
import { Layout } from "../widgets/layout/Layout";
import { getActiveAccount } from "../shared/lib/multiAccountStorage";

export const App = () => {
  useEffect(() => {
    const activeAccount = getActiveAccount();
    if (activeAccount) {
      localStorage.setItem("accessToken", activeAccount.accessToken);
      localStorage.setItem("refreshToken", activeAccount.refreshToken);
    }
  }, []);

  const activeAccount = getActiveAccount();
  const hasToken = activeAccount?.accessToken || !!localStorage.getItem("accessToken");

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Layout>
              <TeamsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:teamId"
        element={
          <ProtectedRoute>
            <Layout>
              <TeamDetailsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          hasToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="*"
        element={
          hasToken ? (
            <Layout>
              <NotFoundPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
// src/features/expense/receipt/ui/ReceiptViewer.jsx
import React, { useState } from 'react';

export const ReceiptViewer = ({ expenseId, onDelete, receiptUrl }) => {
  const [deleting, setDeleting] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this receipt?')) return;

    setDeleting(true);
    try {
      await onDelete(expenseId);
    } catch (err) {
      console.error('Failed to delete receipt:', err);
      alert('Failed to delete receipt');
    } finally {
      setDeleting(false);
    }
  };

  if (!receiptUrl) return <p className="text-gray-500 italic">Loading receipt...</p>;

  return (
    <>
      <div className="relative group">
        <img
          src={receiptUrl}
          alt="Receipt"
          className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowFullscreen(true)}
        />

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowFullscreen(true)}
            type="button"
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors shadow-lg"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            type="button"
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
          >
            {deleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowFullscreen(false)}
            type="button"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <img
            src={receiptUrl}
            alt="Receipt fullscreen"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};import React, { useState } from 'react';

export const ReceiptUpload = ({ expenseId, onUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !expenseId) return;

    setUploading(true);
    setError(null);

    try {
      await onUpload(expenseId, file);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          id={`receipt-${expenseId}`}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {!preview ? (
          <label
            htmlFor={`receipt-${expenseId}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600">Click to upload receipt</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Receipt preview"
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              onClick={clearSelection}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
              disabled={uploading}
              type="button"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span>Upload Receipt</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
export { ReceiptUpload } from './ui/ReceiptUpload';
export { ReceiptViewer } from './ui/ReceiptViewer';import React from 'react';
import { useExpenseExport } from '../model/hooks';

export const ExpenseExport = () => {
  const { exportExpenses, exporting, error } = useExpenseExport();

  const handleExport = async (format) => {
    await exportExpenses(format);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Export Expenses</h2>
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
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
            <span>PDF format: Formatted report ready for printing or sharing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Exports include: ID, Description, Category, Amount, Date</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export { ExpenseExport } from './ui/ExpenseExport';
export { useExpenseExport } from './model/hooks';
export { exportApi } from './model/api';import { useState } from 'react';
import { exportApi } from './api';

export const useExpenseExport = () => {
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

  const exportExpenses = async (format) => {
    setExporting(format);
    setError(null);

    try {
      let blob;
      let fileName;

      if (format === 'csv') {
        blob = await exportApi.exportToCSV();
        fileName = `expenses_export_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (format === 'pdf') {
        blob = await exportApi.exportToPDF();
        fileName = `expenses_report_${new Date().toISOString().split('T')[0]}.pdf`;
      }

      downloadFile(blob, fileName);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to export to ${format.toUpperCase()}`;
      setError(errorMessage);
      console.error('Export failed:', err);
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
};import { axiosInstance } from '../../../../shared/api/axiosInstance';

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
};import React, { useState } from "react";
import { useCategories } from "../../../../entities/category/model/hooks";

export const AddCategoryForm = () => {
  const { addCategory } = useCategories();
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addCategory({ name });
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New category name"
        className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Add
      </button>
    </form>
  );
};
import React, { useState, useRef, useEffect } from "react";
import { useMultiAccount } from "../model/useMultiAccount";
import { useNavigate } from "react-router-dom";

export const AccountSwitcher = () => {
  const { accounts, activeAccount, switchAccount, deleteAccount } = useMultiAccount();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!activeAccount || accounts.length === 0) {
    return null;
  }

  const getInitials = (email, username) => {
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    return email?.charAt(0).toUpperCase() || "?";
  };

  const handleSwitchAccount = (accountId) => {
    switchAccount(accountId);
    setIsOpen(false);
  };

  const handleDeleteAccount = (e, accountId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this account?")) {
      deleteAccount(accountId);
      if (activeAccount.id === accountId && accounts.length > 1) {
        const remainingAccounts = accounts.filter((acc) => acc.id !== accountId);
        if (remainingAccounts.length > 0) {
          switchAccount(remainingAccounts[0].id);
        }
      }
    }
  };

  const handleAddAccount = () => {
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
          {getInitials(activeAccount.email, activeAccount.userInfo?.data?.username)}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-700">
            {activeAccount.userInfo?.data?.username || activeAccount.email.split("@")[0]}
          </div>
          <div className="text-xs text-gray-500">{activeAccount.email}</div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Accounts ({accounts.length})
            </div>

            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleSwitchAccount(account.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  account.id === activeAccount.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials(account.email, account.userInfo?.data?.username)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {account.userInfo?.data?.username || account.email.split("@")[0]}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{account.email}</div>
                  </div>
                  {account.id === activeAccount.id && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
                {accounts.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteAccount(e, account.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Remove account"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={handleAddAccount}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { useAuth } from "../model/hooks";
import { useMultiAccount } from "../model/useMultiAccount";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const { register, loading, error } = useAuth();
  const { addAccountAfterAuth } = useMultiAccount();
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // 🧍‍♂️ додали username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const result = await register({ username, email, password }); // 🧠 передаємо username

    if (result?.data?.accessToken) {
      // Добавляем аккаунт в систему множественных аккаунтов
      await addAccountAfterAuth(
        email,
        result.data.accessToken,
        result.data.refreshToken
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl mb-4">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Account created successfully!
        </h3>
        <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-10 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-2">
        Create Account
      </h2>
      <p className="text-gray-500 text-sm text-center mb-6">
        Fill in the details to sign up
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};
import { useState, useEffect, useCallback } from "react";
import {
  getAllAccounts,
  getActiveAccount,
  setActiveAccount,
  addAccount,
  removeAccount,
  updateAccountUserInfo,
  clearAllAccounts,
} from "../../../shared/lib/multiAccountStorage";
import { axiosInstance } from "../../../shared/api/axiosInstance";

export const useMultiAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccountState] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = useCallback(() => {
    const allAccounts = getAllAccounts();
    const active = getActiveAccount();
    setAccounts(allAccounts);
    setActiveAccountState(active);
  }, []);

  const addAccountAfterAuth = useCallback(
    async (email, accessToken, refreshToken) => {
      setLoading(true);
      try {
        let userInfo = null;
        try {
          const response = await axiosInstance.get("/api/v1/users/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          userInfo = response.data;
        } catch (err) {
          console.error("Failed to fetch user info:", err);
        }

        const account = addAccount({
          email,
          accessToken,
          refreshToken,
          userInfo,
        });

        setActiveAccount(account.id);

        loadAccounts();
        return account;
      } catch (error) {
        console.error("Error adding account:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadAccounts]
  );

  const switchAccount = useCallback(
    async (accountId) => {
      const success = setActiveAccount(accountId);
      if (success) {
        try {
          const { data } = await axiosInstance.get("/api/v1/users/me");
          updateAccountUserInfo(accountId, data);
        } catch (error) {
          console.error("Error updating user info:", error);
        }
        loadAccounts();
        window.location.reload();
      }
      return success;
    },
    [loadAccounts]
  );

  const deleteAccount = useCallback(
    (accountId) => {
      removeAccount(accountId);
      loadAccounts();
    },
    [loadAccounts]
  );

  const updateUserInfo = useCallback(
    async (accountId) => {
      try {
        const { data } = await axiosInstance.get("/api/v1/users/me");
        updateAccountUserInfo(accountId, data);
        loadAccounts();
      } catch (error) {
        console.error("Error updating user info:", error);
      }
    },
    [loadAccounts]
  );

  const logoutAll = useCallback(() => {
    clearAllAccounts();
    setAccounts([]);
    setActiveAccountState(null);
  }, []);

  return {
    accounts,
    activeAccount,
    loading,
    addAccountAfterAuth,
    switchAccount,
    deleteAccount,
    updateUserInfo,
    logoutAll,
    refreshAccounts: loadAccounts,
  };
};

import { useState } from "react";
import { login, register } from "./api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await login(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await register(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login: loginUser,
    register: registerUser,
    loading,
    error,
  };
};
import { axiosInstance } from "../../../shared/api/axiosInstance";

export const login = async (data) => {
  const response = await axiosInstance.post("/api/v1/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await axiosInstance.post("/api/v1/auth/register", data);
  return response.data;
};
import React, { useState } from "react";
import { useAuth } from "../model/hooks";
import { useMultiAccount } from "../model/useMultiAccount";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ onSwitchToRegister }) => {
  const { login, loading, error } = useAuth();
  const { addAccountAfterAuth } = useMultiAccount();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login({ email, password });

    if (result?.success) {
      if (result.data?.accessToken) {
        // Добавляем аккаунт в систему множественных аккаунтов
        await addAccountAfterAuth(
          email,
          result.data.accessToken,
          result.data.refreshToken
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {!success ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-10 rounded-xl shadow-lg w-full border border-gray-200"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800">Sign In</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your credentials to continue
            </p>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full p-4 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <span className={loading ? "opacity-0" : "opacity-100"}>Sign In</span>
            {loading && (
              <span className="absolute left-1/2 top-1/2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin -translate-x-1/2 -translate-y-1/2"></span>
            )}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <p className="text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-500 hover:underline"
            >
              Create one
            </button>
          </p>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white p-10 rounded-xl shadow-lg w-full text-center">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl mb-4">
            ✓
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Welcome back!
          </h3>
          <p className="text-gray-500 text-sm">
            Redirecting to your dashboard...
          </p>
        </div>
      )}
    </div>
  );
};import React, { useState, useMemo } from "react";
import { useCategories } from "../../../../entities/category/model/hooks";
import { SearchInput } from "../../../../shared/ui/SearchInput";

const ITEMS_PER_PAGE = 10;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPageNumbers().map((page, idx) => (
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              currentPage === page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export const TeamExpensesList = ({ expenses, hasNext, onLoadMore, loading, onUpdate, onDelete }) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    description: "",
    categoryId: "",
    amount: "",
    date: "",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const searchLower = search.toLowerCase();

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) =>
      e.description.toLowerCase().includes(searchLower) ||
      e.categoryName.toLowerCase().includes(searchLower) ||
      e.amount.toString().includes(searchLower)
    );
  }, [expenses, searchLower]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-lg">No team expenses yet</p>
        <p className="text-gray-500 text-sm mt-2">Create your first team expense</p>
      </div>
    );
  }

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      description: expense.description,
      categoryId: expense.categoryId.toString(),
      amount: expense.amount,
      date: expense.date,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    const { description, categoryId, amount, date } = editData;

    if (!description || !categoryId || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat.id === Number(categoryId)
    );

    if (!selectedCategory) {
      alert("Selected category is invalid");
      return;
    }

    try {
      await onUpdate(editingId, {
        description,
        categoryId: selectedCategory.id,
        amount: Number(amount),
        date,
      });
      setEditingId(null);
    } catch (err) {
      alert(err.message || "Failed to update expense");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team expense?")) {
      try {
        await onDelete(id);
      } catch (err) {
        alert(err.message || "Failed to delete expense");
      }
    }
  };

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={(query) => {
          setSearch(query);
          setCurrentPage(1);
        }}
        onClear={() => {
          setSearch("");
          setCurrentPage(1);
        }}
        placeholder="Search..."
      />

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No expenses found</p>
          <p className="text-gray-500 text-sm mt-2">Try different search terms</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredExpenses.length)} of {filteredExpenses.length} expenses
          </div>

          <div className="space-y-3">
            {paginatedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingId === expense.id ? (
                  <div className="flex flex-col gap-3">
                    <input
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                      className="border border-gray-300 p-3 rounded-lg"
                      placeholder="Description"
                    />
                    <select
                      name="categoryId"
                      value={editData.categoryId}
                      onChange={handleEditChange}
                      className="border border-gray-300 p-3 rounded-lg"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      name="amount"
                      value={editData.amount}
                      onChange={handleEditChange}
                      className="border border-gray-300 p-3 rounded-lg"
                      placeholder="Amount"
                    />
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleEditChange}
                      className="border border-gray-300 p-3 rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={submitEdit}
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {expense.description}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {expense.categoryName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{expense.date}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${expense.amount}</p>
                      </div>

                      <button
                        onClick={() => startEdit(expense)}
                        type="button"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(expense.id)}
                        type="button"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {hasNext && (
        <div className="flex justify-center pt-6 border-t mt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading more...</span>
              </>
            ) : (
              <>
                <span>Load More from Server</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};import React, { useState } from "react";
import { useCategories } from "../../../../entities/category/model/hooks";

export const CreateTeamExpenseForm = ({ onCreate }) => {
  const { categories, loading: categoriesLoading } = useCategories();

  const [expense, setExpense] = useState({
    categoryId: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expense.categoryId || !expense.description.trim() || !expense.amount || !expense.date) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate({
        categoryId: parseInt(expense.categoryId),
        description: expense.description.trim(),
        amount: parseFloat(expense.amount),
        date: expense.date,
      });

      setExpense({
        categoryId: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setError(err.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={expense.categoryId}
            onChange={(e) => setExpense({ ...expense, categoryId: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || categoriesLoading}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            placeholder="0.00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={expense.description}
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
          placeholder="Enter description"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={expense.date}
          onChange={(e) => setExpense({ ...expense, date: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Team Expense</span>
          </>
        )}
      </button>
    </form>
  );
};import React, { useState } from "react";
import { useTeams } from "../../../../entities/team/model/hooks";
import { teamApi } from "../../../../entities/team/model/api";

export const ShareExpenseModal = ({ expenseId, onClose, onSuccess }) => {
  const { teams } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [mode, setMode] = useState("MOVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeamId) {
      setError("Please select a team");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await teamApi.shareExpense(expenseId, {
        teamId: parseInt(selectedTeamId),
        mode,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to share expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Share Expense to Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-2">
              Select Team
            </label>
            <select
              id="team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            >
              <option value="">Choose a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="MOVE"
                  checked={mode === "MOVE"}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Move (remove from personal expenses)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="COPY_REFERENCE"
                  checked={mode === "COPY_REFERENCE"}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Copy (keep in personal expenses)
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sharing..." : "Share Expense"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};export { TeamExpensesList } from './ui/TeamExpensesList';
export { CreateTeamExpenseForm } from './ui/CreateTeamExpenseForm';
export { ShareExpenseModal } from './ui/ShareExpenseModal';export { CreateTeamForm } from './create/ui/CreateTeamForm';
export { AddMemberForm } from './add-member/ui/AddMemberForm';
export { MembersList } from './members/ui/MembersList';import React from "react";
import { Modal } from "../../../../shared/ui/Modal";

export const ChangeRoleConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentRole, 
  newRole,
  memberName 
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Change Member Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to change the role for{" "}
            <span className="font-semibold text-gray-900">{memberName}</span>?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current role:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentRole === "OWNER"
                    ? "bg-purple-100 text-purple-700"
                    : currentRole === "ADMIN"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {currentRole}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New role:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  newRole === "OWNER"
                    ? "bg-purple-100 text-purple-700"
                    : newRole === "ADMIN"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {newRole}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Confirm Change
          </button>
        </div>
      </div>
    </Modal>
  );
};

export { ChangeRoleConfirmModal } from "./ui/ChangeRoleConfirmModal";

import React, { useState } from "react";

export const AddMemberForm = ({ onAdd, onCancel }) => {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }

    const userIdNumber = parseInt(userId);
    if (isNaN(userIdNumber) || userIdNumber <= 0) {
      setError("Please enter a valid User ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Передаємо правильний формат даних
      await onAdd({
        userId: userIdNumber,
        role: role
      });

      // Очищаємо форму тільки після успішного додавання
      setUserId("");
      setRole("MEMBER");

      // Закриваємо форму
      onCancel?.();
    } catch (err) {
      // Обробляємо різні типи помилок
      const errorMessage = err.response?.data?.message
        || err.message
        || "Failed to add member";

      setError(errorMessage);
      console.error("Add member error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
          User ID
        </label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID (e.g., 2)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          min="1"
          step="1"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter the numeric ID of the user you want to add
        </p>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Choose the role for this team member
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Member</span>
            </>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};import React, { useState } from "react";
import { ChangeRoleConfirmModal } from "../../change-role";

export const MembersList = ({ members, currentUserId, onChangeRole, onRemove, canManage }) => {
  const [changingRole, setChangingRole] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const handleChangeRoleClick = (member) => {
    const newRole = member.role === "MEMBER" ? "ADMIN" : "MEMBER";
    setConfirmModal({
      userId: member.userId,
      memberName: member.email?.split('@')[0] || member.email,
      currentRole: member.role,
      newRole,
    });
  };

  const handleConfirmRoleChange = async () => {
    if (!confirmModal) return;

    setChangingRole(confirmModal.userId);
    try {
      await onChangeRole(confirmModal.userId, confirmModal.newRole);
      setConfirmModal(null);
    } catch (err) {
      alert(err.message || "Failed to change role");
    } finally {
      setChangingRole(null);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    setRemoving(userId);
    try {
      await onRemove(userId);
    } catch (err) {
      alert(err.message || "Failed to remove member");
    } finally {
      setRemoving(null);
    }
  };

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No members in this team
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.userId}
          className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {member.role?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {member.email?.split('@')[0] || member.email}
                {member.userId === currentUserId && (
                  <span className="text-xs text-gray-500">(You)</span>
                )}
              </p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                member.role === "OWNER"
                  ? "bg-purple-100 text-purple-700"
                  : member.role === "ADMIN"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {member.role}
            </span>

            {canManage && member.role !== "OWNER" && member.userId !== currentUserId && (
              <>
                <button
                  onClick={() => handleChangeRoleClick(member)}
                  disabled={changingRole === member.userId}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Change role"
                >
                  {changingRole === member.userId ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleRemove(member.userId)}
                  disabled={removing === member.userId}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Remove member"
                >
                  {removing === member.userId ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {confirmModal && (
        <ChangeRoleConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={handleConfirmRoleChange}
          currentRole={confirmModal.currentRole}
          newRole={confirmModal.newRole}
          memberName={confirmModal.memberName}
        />
      )}
    </div>
  );
};import React from 'react';
import { useTeamExpenseExport } from '../model/hooks';

export const TeamExpenseExport = ({ teamId, userRole }) => {
  const { exportExpenses, exporting, error } = useTeamExpenseExport();

  const canExport = userRole === 'OWNER' || userRole === 'ADMIN';

  const handleExport = async (format) => {
    if (!canExport) {
      alert('Only team OWNER and ADMIN can export reports');
      return;
    }
    await exportExpenses(teamId, format);
  };

  if (!canExport) {
    return (
      <div className="bg-gray-50 rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
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
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
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
    </div>
  );
};
export { TeamExpenseExport } from './ui/TeamExpenseExport';
export { useTeamExpenseExport } from './model/hooks';
export { teamExportApi } from './model/api';import { useState } from 'react';
import { teamExportApi } from './api';

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
      console.error('Export failed:', err);
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
};import { axiosInstance } from '../../../../shared/api/axiosInstance';

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
};import React, { useState } from "react";

export const CreateTeamForm = ({ onCreate, onCancel }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Team name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate({ name: name.trim() });
      setName("");
      onCancel?.();
    } catch (err) {
      setError(err.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
          Team Name
        </label>
        <input
          id="teamName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter team name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};import React from "react";

export const SearchInput = ({ value, onChange, onClear, placeholder = "Search..." }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
import React, { useEffect } from "react";

export const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
};import React from "react";
import { Navigate } from "react-router-dom";
import { getActiveAccount } from "../lib/multiAccountStorage";

export const ProtectedRoute = ({ children }) => {
  const activeAccount = getActiveAccount();
  const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
// src/shared/ui/ConfirmModal.jsx
import React from "react";
import { Modal } from "./Modal";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger"
}) => {
  if (!isOpen) return null;

  const getColorClasses = () => {
    switch (type) {
      case "danger":
        return {
          button: "bg-red-500 hover:bg-red-600",
          icon: "text-red-600",
          iconBg: "bg-red-100"
        };
      case "warning":
        return {
          button: "bg-yellow-500 hover:bg-yellow-600",
          icon: "text-yellow-600",
          iconBg: "bg-yellow-100"
        };
      case "info":
        return {
          button: "bg-blue-500 hover:bg-blue-600",
          icon: "text-blue-600",
          iconBg: "bg-blue-100"
        };
      default:
        return {
          button: "bg-red-500 hover:bg-red-600",
          icon: "text-red-600",
          iconBg: "bg-red-100"
        };
    }
  };

  const colors = getColorClasses();

  const getIcon = () => {
    switch (type) {
      case "danger":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        );
      case "warning":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      case "info":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      default:
        return null;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const showCancelButton = cancelText && cancelText.trim() !== "";

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            <svg
              className={`w-6 h-6 ${colors.icon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {getIcon()}
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-sm whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          {showCancelButton && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};const ACCOUNTS_STORAGE_KEY = "multiAccounts";
const ACTIVE_ACCOUNT_KEY = "activeAccountId";

export const getAllAccounts = () => {
  try {
    const accountsJson = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return accountsJson ? JSON.parse(accountsJson) : [];
  } catch (error) {
    console.error("Error reading accounts:", error);
    return [];
  }
};

const saveAllAccounts = (accounts) => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error("Error saving accounts:", error);
  }
};

export const addAccount = (accountData) => {
  const accounts = getAllAccounts();
  const { email, accessToken, refreshToken, userInfo } = accountData;

  const existingIndex = accounts.findIndex((acc) => acc.email === email);

  const account = {
    id: existingIndex >= 0 ? accounts[existingIndex].id : Date.now().toString(),
    email,
    accessToken,
    refreshToken,
    userInfo: userInfo || (existingIndex >= 0 ? accounts[existingIndex].userInfo : null),
    addedAt: existingIndex >= 0 ? accounts[existingIndex].addedAt : new Date().toISOString(),
    lastUsedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    if (userInfo) {
      accounts[existingIndex] = account;
    } else {
      accounts[existingIndex].accessToken = accessToken;
      accounts[existingIndex].refreshToken = refreshToken;
      accounts[existingIndex].lastUsedAt = new Date().toISOString();
    }
  } else {
    accounts.push(account);
  }

  saveAllAccounts(accounts);
  return account;
};

export const getActiveAccount = () => {
  const activeAccountId = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
  if (!activeAccountId) return null;

  const accounts = getAllAccounts();
  return accounts.find((acc) => acc.id === activeAccountId) || null;
};

export const setActiveAccount = (accountId) => {
  const accounts = getAllAccounts();
  const account = accounts.find((acc) => acc.id === accountId);

  if (!account) {
    console.error("Account not found:", accountId);
    return false;
  }

  account.lastUsedAt = new Date().toISOString();
  saveAllAccounts(accounts);

  localStorage.setItem(ACTIVE_ACCOUNT_KEY, accountId);
  localStorage.setItem("accessToken", account.accessToken);
  localStorage.setItem("refreshToken", account.refreshToken);

  return true;
};

export const removeAccount = (accountId) => {
  const accounts = getAllAccounts();
  const filteredAccounts = accounts.filter((acc) => acc.id !== accountId);

  saveAllAccounts(filteredAccounts);

  const activeAccountId = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
  if (activeAccountId === accountId) {
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  return filteredAccounts;
};

export const updateActiveAccountTokens = (accessToken, refreshToken) => {
  const activeAccount = getActiveAccount();
  if (!activeAccount) return false;

  activeAccount.accessToken = accessToken;
  activeAccount.refreshToken = refreshToken;
  activeAccount.lastUsedAt = new Date().toISOString();

  const accounts = getAllAccounts();
  const accountIndex = accounts.findIndex((acc) => acc.id === activeAccount.id);
  if (accountIndex >= 0) {
    accounts[accountIndex] = activeAccount;
    saveAllAccounts(accounts);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return true;
  }

  return false;
};

export const updateAccountUserInfo = (accountId, userInfo) => {
  const accounts = getAllAccounts();
  const accountIndex = accounts.findIndex((acc) => acc.id === accountId);

  if (accountIndex >= 0) {
    accounts[accountIndex].userInfo = userInfo;
    saveAllAccounts(accounts);
    return true;
  }

  return false;
};

export const clearAllAccounts = () => {
  localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

import axios from "axios";
import { getActiveAccount, updateActiveAccountTokens } from "../lib/multiAccountStorage";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

const axiosRefresh = axios.create({
  baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const activeAccount = getActiveAccount();
      const token = activeAccount?.accessToken || localStorage.getItem("accessToken");
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const activeAccount = getActiveAccount();
        const refreshToken = activeAccount?.refreshToken || localStorage.getItem("refreshToken");
        
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axiosRefresh.post("/api/v1/auth/refresh", { refreshToken });

        const updated = updateActiveAccountTokens(
          data.data.accessToken,
          data.data.refreshToken
        );

        if (!updated) {
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired, logging out...");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./app/providers/index";
import { App } from "./app/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
// src/pages/not-found/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-300 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 text-center px-4">
      {/* 404 Number with glow effect */}
      <div className="mb-8">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400 drop-shadow-lg">
          404
        </h1>
        <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400 rounded-full"></div>
      </div>

      {/* Message */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist. Let's get you back on track.
      </p>

      {/* Button */}
      <Link
        to="/dashboard"
        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
      >
        <span className="relative z-10">Back to Dashboard</span>
        <svg
          className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
    </div>

    {/* Floating particles effect */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-ping delay-500"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-sky-400 rounded-full opacity-30 animate-ping delay-1000"></div>
      <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-30 animate-ping delay-700"></div>
    </div>

    {/* Abstract decorative shapes */}
    <div className="absolute top-10 right-10 w-20 h-20 border-4 border-blue-200 rounded-lg rotate-12 opacity-50"></div>
    <div className="absolute bottom-10 left-10 w-16 h-16 border-4 border-cyan-200 rounded-full opacity-50"></div>
  </div>
);import React, { useState } from "react";
import { LoginForm } from "../../features/auth/login/LoginForm";
import { RegisterForm } from "../../features/auth/register/RegisterForm";

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      {isRegister ? (
        <RegisterForm onSwitchToLogin={() => setIsRegister(false)} />
      ) : (
        <LoginForm onSwitchToRegister={() => setIsRegister(true)} />
      )}
    </div>
  );
};
export { AuthPage } from './auth/AuthPage';
export { DashboardPage } from './dashboard/DashboardPage';
export { NotFoundPage } from './not-found/NotFoundPage';
export { TeamsPage } from './teams/TeamsPage';
export { TeamDetailsPage } from './teams/TeamDetailsPage';// src/pages/dashboard/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../../entities/user/model/hooks";
import { useExpenses } from "../../entities/expense/model/hooks";
import { useCategories } from "../../entities/category/model/hooks";
import { ProfileCard } from "../../entities/user/ui/ProfileCard";
import { ExpenseForm } from "../../entities/expense/ui/ExpenseForm";
import { ExpenseList } from "../../entities/expense/ui/ExpenseList";
import { CategoryForm } from "../../entities/category/ui/CategoryForm";
import { CategoryList } from "../../entities/category/ui/CategoryList";
import { StatsCards } from "../../widgets/stats/StatsCards";
import { ChartsSection } from "../../widgets/charts/ChartsSection";
import { Navigation } from "../../widgets/navigation/Navigation";
import { ExpenseExport } from "../../features/expense/export/ui/ExpenseExport";
import { ConfirmModal } from "../../shared/ui/ConfirmModal";

export const DashboardPage = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const {
    expenses,
    hasNext,
    loading: expensesLoading,
    errorModal: expenseErrorModal,
    addExpense,
    deleteExpense,
    updateExpense,
    uploadReceipt,
    deleteReceipt,
    loadMore,
    clearErrorModal: clearExpenseError
  } = useExpenses();

  const {
    addCategory,
    updateCategory,
    deleteCategory,
    errorModal: categoryErrorModal,
    clearErrorModal: clearCategoryError
  } = useCategories();

  const [activeErrorModal, setActiveErrorModal] = useState(null);

  // Sync error modals
  useEffect(() => {
    if (expenseErrorModal) {
      setActiveErrorModal(expenseErrorModal);
    } else if (categoryErrorModal) {
      setActiveErrorModal(categoryErrorModal);
    }
  }, [expenseErrorModal, categoryErrorModal]);

  const handleCloseErrorModal = () => {
    setActiveErrorModal(null);
    clearExpenseError?.();
    clearCategoryError?.();
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (userError) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-4">
          {userError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="flex-1 w-full min-h-0 mt-3">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full h-full overflow-hidden">

          {/* LEFT COLUMN */}
          <div className="h-full overflow-y-auto space-y-4">

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Categories</h2>
              <CategoryForm onAdd={addCategory} />
              <div className="mt-6">
                <CategoryList
                  onUpdate={updateCategory}
                  onDelete={deleteCategory}
                />
              </div>
            </div>

            <ExpenseExport />
          </div>

          {/* CENTER COLUMN */}
          <div className="lg:col-span-2 h-full overflow-y-auto space-y-4">

            <StatsCards />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ChartsSection />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Personal Expenses</h2>

              <ExpenseList
                expenses={expenses}
                hasNext={hasNext}
                loading={expensesLoading}
                onLoadMore={loadMore}
                onDelete={deleteExpense}
                onUpdate={updateExpense}
                onUploadReceipt={uploadReceipt}
                onDeleteReceipt={deleteReceipt}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="h-full overflow-y-auto space-y-4">

            <ProfileCard user={user} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Add Expense</h2>
              <ExpenseForm onAdd={addExpense} />
            </div>

          </div>

        </div>
      </div>

      {/* Global Error Modal */}
      {activeErrorModal && (
        <ConfirmModal
          isOpen={!!activeErrorModal}
          onClose={handleCloseErrorModal}
          onConfirm={handleCloseErrorModal}
          title={activeErrorModal.title}
          message={activeErrorModal.message}
          confirmText="OK"
          cancelText=""
          type={activeErrorModal.type || 'danger'}
        />
      )}
    </div>
  );
};// src/pages/teams/TeamDetailsPage.jsx
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeamDetails, useTeamExpenses } from "../../entities/team/model/hooks";
import { useUser } from "../../entities/user/model/hooks";
import { AddMemberForm } from "../../features/team/add-member/ui/AddMemberForm";
import { MembersList } from "../../features/team/members/ui/MembersList";
import { TeamExpensesList } from "../../features/team/expenses/ui/TeamExpensesList";
import { CreateTeamExpenseForm } from "../../features/team/expenses/ui/CreateTeamExpenseForm";
import { TeamExpenseExport } from "../../features/team/export/ui/TeamExpenseExport";
import { Modal } from "../../shared/ui/Modal";

export const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    team,
    loading: teamLoading,
    error: teamError,
    addMember,
    changeMemberRole,
    removeMember,
  } = useTeamDetails(parseInt(teamId));

  const {
    expenses,
    hasNext,
    loading: expensesLoading,
    error: expensesError,
    loadMore,
    createExpense,
    updateExpense,
    deleteExpense,
  } = useTeamExpenses(parseInt(teamId));

  const [activeTab, setActiveTab] = useState("expenses");
  const [showAddMember, setShowAddMember] = useState(false);

  const currentUserId = user?.data?.id;

  const userRole = useMemo(() => {
    if (!team?.members || !currentUserId) return null;

    const currentMember = team.members.find(
      member => member.userId === currentUserId
    );

    return currentMember?.role || null;
  }, [team?.members, currentUserId]);

  const canManage = userRole === "OWNER" || userRole === "ADMIN";

  if (teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (teamError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {teamError}
          </div>
          <button
            onClick={() => navigate("/teams")}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            ← Back to Teams
          </button>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Team not found</p>
            <button
              onClick={() => navigate("/teams")}
              className="text-blue-500 hover:text-blue-600"
            >
              ← Back to Teams
            </button>
          </div>
        </div>
      </div>
    );
  }

  const memberCount = team.members?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Teams
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-600 mt-1">
                {memberCount} member{memberCount !== 1 ? 's' : ''} •
                Your role: <span className={`font-medium ${
                  userRole === 'OWNER' ? 'text-purple-600' :
                  userRole === 'ADMIN' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>{userRole || 'Unknown'}</span>
                {canManage && (
                  <span className="ml-2 text-green-600">
                    ✓ Can manage
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("expenses")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "expenses"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  Expenses
                </span>
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "members"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Members
                </span>
              </button>
              <button
                onClick={() => setActiveTab("export")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "export"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "expenses" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Expense</h2>
                <CreateTeamExpenseForm onCreate={createExpense} />
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Team Expenses</h2>

                {expensesError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {expensesError}
                  </div>
                )}

                <TeamExpensesList
                  expenses={expenses}
                  hasNext={hasNext}
                  onLoadMore={loadMore}
                  loading={expensesLoading}
                  onUpdate={updateExpense}
                  onDelete={deleteExpense}
                />
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                {canManage ? (
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Member
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Only OWNER and ADMIN can add members
                  </div>
                )}
              </div>

              <MembersList
                members={team.members}
                currentUserId={currentUserId}
                onChangeRole={changeMemberRole}
                onRemove={removeMember}
                canManage={canManage}
              />
            </div>
          )}

          {activeTab === "export" && (
            <TeamExpenseExport teamId={parseInt(teamId)} userRole={userRole} />
          )}
        </div>

        {/* Add Member Modal */}
        {showAddMember && (
          <Modal onClose={() => setShowAddMember(false)}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
                <button
                  onClick={() => setShowAddMember(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AddMemberForm
                onAdd={addMember}
                onCancel={() => setShowAddMember(false)}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};// src/pages/teams/TeamsPage.jsx
import React, { useState } from "react";
import { useTeams } from "../../entities/team/model/hooks";
import { TeamList } from "../../entities/team/ui/TeamList";
import { CreateTeamForm } from "../../features/team/create/ui/CreateTeamForm";
import { Modal } from "../../shared/ui/Modal";
import { Navigation } from "../../widgets/navigation/Navigation";

export const TeamsPage = () => {
  const { teams, loading, error, createTeam, fetchTeams } = useTeams();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateTeam = async (teamData) => {
    await createTeam(teamData);
    await fetchTeams();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
            <p className="text-gray-600 mt-1">Manage your teams and collaborate with others</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Team
          </button>
        </div>

        <TeamList teams={teams} loading={loading} error={error} />
        
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Team</h2>
              <CreateTeamForm
                onCreate={handleCreateTeam}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};import React from "react";

export const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);
export { Layout } from './Layout';import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccountSwitcher } from "../../features/auth/ui/AccountSwitcher";
import { useMultiAccount } from "../../features/auth/model/useMultiAccount";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAll, activeAccount } = useMultiAccount();

  const handleLogout = () => {
    if (window.confirm("Log out from all accounts?")) {
      logoutAll();
      navigate("/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <nav className="bg-white shadow-sm border border-gray-200 w-full rounded-xl">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16 w-full">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ExpenseTracker
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/teams"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive("/teams")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Teams
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {activeAccount && <AccountSwitcher />}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-1 pb-3 w-full">
          <Link
            to="/dashboard"
            className={`flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/teams"
            className={`flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/teams")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Teams
          </Link>
        </div>
      </div>
    </nav>
  );
};
export { Navigation } from './Navigation';
import { useState } from 'react';
import { CategoryChart } from './CategoryChart';
import { ExpenseTrendChart } from './ExpenseTrendChart';

// Define a consistent chart height for both charts
const CHART_HEIGHT_CLASS = 'h-[400px]';

export const ChartsSection = () => {
  const [period, setPeriod] = useState('daily');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
      {/* Category Distribution Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">Category Distribution</h2>
        <div className={`flex-1 ${CHART_HEIGHT_CLASS}`}>
          <CategoryChart />
        </div>
      </div>

      {/* Expense Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-extrabold text-gray-800">Expense Trend</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm hover:border-blue-400 transition"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className={`flex-1 ${CHART_HEIGHT_CLASS}`}>
          <ExpenseTrendChart period={period} />
        </div>
      </div>
    </div>
  );
};// src/widgets/charts/ExpenseTrendChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useStats } from '../../entities/stats';

const formatDateLabel = (dateStr, period) => {
  const date = new Date(dateStr);

  switch (period) {
    case 'daily':
      return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
    case 'weekly':
      return `Week ${date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}`;
    case 'monthly':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    default:
      return dateStr;
  }
};

const groupByPeriod = (byDate, period) => {
  if (!byDate || byDate.length === 0) return [];

  const dateMap = byDate.reduce((acc, item) => {
    const date = new Date(item.date);
    let key;

    switch (period) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!acc[key]) acc[key] = 0;
    acc[key] += item.totalAmount;

    return acc;
  }, {});

  return Object.entries(dateMap)
    .map(([date, amount]) => ({
      date: formatDateLabel(date, period),
      amount: parseFloat(amount.toFixed(2)),
      rawDate: date
    }))
    .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
};

export const ExpenseTrendChart = ({ period = 'daily' }) => {
  const { stats, loading, error } = useStats();

  const chartData = useMemo(() => {
    if (!stats?.byDate) return [];
    return groupByPeriod(stats.byDate, period);
  }, [stats?.byDate, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data to display
      </div>
    );
  }

  const maxAmount = Math.max(...chartData.map(d => d.amount));
  const yAxisMax = Math.ceil(maxAmount * 1.1);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `$${value}`}
            domain={[0, yAxisMax]}
            stroke="#9ca3af"
            width={80}
          />
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, 'Total']}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7, fill: '#2563eb' }}
            name="Expenses"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};// src/widgets/charts/CategoryChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo, useState } from 'react';
import { useStats } from '../../entities/stats';
import { useCategories } from '../../entities/category/model/hooks';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c',
  '#8dd1e1', '#d084d0', '#a4de6c', '#ffa07a'
];

export const CategoryChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { stats, loading, error } = useStats();
  const { categories } = useCategories();

  const chartData = useMemo(() => {
    if (!stats?.byCategory || !categories) return [];

    return Object.entries(stats.byCategory)
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === parseInt(categoryId));
        return {
          name: category?.name || `Category ${categoryId}`,
          value: parseFloat(amount.toFixed(2))
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [stats?.byCategory, categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data to display
      </div>
    );
  }

  const renderCustomLabel = (entry) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full">
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.6}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend with scrolling */}
      <div className="mt-4 max-h-32 overflow-y-auto border-t pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chartData.map((entry, index) => {
            const percent = ((entry.value / total) * 100).toFixed(1);
            return (
              <div
                key={`legend-${index}`}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-sm text-gray-700 truncate"
                      title={entry.name}
                    >
                      {entry.name}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {percent}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    ${entry.value.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};// src/widgets/stats/index.js
export { StatsCards } from './StatsCards';// src/widgets/stats/StatsCards.jsx
import { useStats } from '../../entities/stats';

export const StatsCards = () => {
  const { stats, loading, error } = useStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { totalAmount = 0, count = 0 } = stats;
  const average = count > 0 ? (totalAmount / count).toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Total Expenses</h3>
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Transactions</h3>
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-3xl font-bold">{count}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Average</h3>
          <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <p className="text-3xl font-bold">${average}</p>
      </div>
    </div>
  );
};// src/entities/expense/ui/ExpenseForm.jsx
import React, { useState } from "react";
import { useCategories } from "../../category/model/hooks";

export const ExpenseForm = ({ onAdd }) => {
  const { categories, loading } = useCategories();

  const [expense, setExpense] = useState({
    categoryId: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expense.categoryId || !expense.description.trim() || !expense.amount || !expense.date) {
      alert("Please fill in all fields");
      return;
    }

    const selectedCategory = categories.find(cat => cat.id === Number(expense.categoryId));

    try {
      await onAdd({
        categoryId: selectedCategory?.id,
        categoryName: selectedCategory?.name,
        description: expense.description,
        amount: Number(expense.amount),
        date: expense.date,
      });

      setExpense({
        categoryId: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      // Error handled by useExpenses hook and shown in modal
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 bg-white p-4 rounded shadow"
    >
      {loading && <p className="text-gray-500">Loading categories...</p>}

      <select
        value={expense.categoryId}
        onChange={(e) => setExpense({ ...expense, categoryId: e.target.value })}
        className="border p-2 rounded"
        required
        disabled={loading}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Description"
        value={expense.description}
        onChange={(e) => setExpense({ ...expense, description: e.target.value })}
        className="border p-2 rounded"
        required
      />

      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={expense.amount}
        onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
        className="border p-2 rounded"
        required
      />

      <input
        type="date"
        value={expense.date}
        onChange={(e) => setExpense({ ...expense, date: e.target.value })}
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Expense
      </button>
    </form>
  );
};import React, { useState, useMemo } from "react";
import { useCategories } from "../../category/model/hooks";
import { ReceiptUpload } from "../../../features/expense/receipt/ui/ReceiptUpload";
import { ReceiptViewer } from "../../../features/expense/receipt/ui/ReceiptViewer";
import { ShareExpenseModal } from "../../../features/team/expenses/ui/ShareExpenseModal";
import { SearchInput } from "../../../shared/ui/SearchInput";
import { ConfirmModal } from "../../../shared/ui/ConfirmModal";

const INITIAL_EDIT_DATA = {
  description: "",
  categoryId: "",
  amount: "",
  date: "",
};

const ITEMS_PER_PAGE = 10;

const EmptyState = () => (
  <div className="text-center py-12">
    <p className="text-gray-400 text-lg">No expenses yet</p>
    <p className="text-gray-500 text-sm mt-2">Add your first expense</p>
  </div>
);

const EditForm = ({ editData, categories, onChange, onSave, onCancel }) => (
  <div className="flex flex-col gap-2">
    <input
      name="description"
      value={editData.description}
      onChange={onChange}
      className="border p-2 rounded"
      placeholder="Description"
    />
    <select
      name="categoryId"
      value={editData.categoryId}
      onChange={onChange}
      className="border p-2 rounded"
      required
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id.toString()}>
          {cat.name}
        </option>
      ))}
    </select>
    <input
      type="number"
      name="amount"
      value={editData.amount}
      onChange={onChange}
      className="border p-2 rounded"
      placeholder="Amount"
    />
    <input
      type="date"
      name="date"
      value={editData.date}
      onChange={onChange}
      className="border p-2 rounded"
    />
    <div className="flex gap-2 mt-2">
      <button
        onClick={onSave}
        type="button"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        type="button"
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
);

const ExpenseItem = ({
  expense,
  categoryName,
  onEdit,
  onDelete,
  onUploadReceipt,
  onDeleteReceipt,
  onShare,
}) => {
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-lg truncate" title={expense.description}>
              {expense.description}
            </h3>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 truncate max-w-[150px]"
              title={categoryName}
            >
              {categoryName}
            </span>
          </div>
          <p className="text-sm text-gray-500">{expense.date}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right mr-2">
            <p className="text-2xl font-bold text-gray-900 whitespace-nowrap">${expense.amount}</p>
          </div>

          <button
            onClick={() => setShowReceipt(!showReceipt)}
            type="button"
            className={`p-2 rounded-lg transition-colors ${
              showReceipt || expense.receiptUrl
                ? 'text-green-500 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={expense.receiptUrl ? "View receipt" : "Add receipt"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          <button
            onClick={onShare}
            type="button"
            className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
            title="Share to team"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>

          <button
            onClick={onEdit}
            type="button"
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            type="button"
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {showReceipt && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Receipt</h4>
            <button
              onClick={() => setShowReceipt(false)}
              type="button"
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Hide
            </button>
          </div>
          {expense.receiptUrl ? (
            <ReceiptViewer
              expenseId={expense.id}
              receiptUrl={expense.receiptUrl}
              onDelete={onDeleteReceipt}
            />
          ) : (
            <ReceiptUpload
              expenseId={expense.id}
              onUpload={onUploadReceipt}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPageNumbers().map((page, idx) => (
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              currentPage === page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export const ExpenseList = ({
  expenses = [],
  hasNext = false,
  loading = false,
  onLoadMore,
  onDelete,
  onUpdate,
  onUploadReceipt,
  onDeleteReceipt
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(INITIAL_EDIT_DATA);
  const [sharingExpenseId, setSharingExpenseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses;

    const query = searchQuery.toLowerCase();
    return expenses.filter((expense) => {
      const description = expense.description?.toLowerCase() || "";
      const category = expense.categoryName?.toLowerCase() || "";
      const amount = expense.amount?.toString() || "";

      return (
        description.includes(query) ||
        category.includes(query) ||
        amount.includes(query)
      );
    });
  }, [expenses, searchQuery]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setConfirmModal({
      type: 'delete',
      id,
      title: 'Delete Expense',
      message: 'Are you sure you want to delete this expense? This action cannot be undone.',
      confirmText: 'Delete'
    });
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      description: expense.description,
      categoryId: expense.categoryId.toString(),
      amount: expense.amount,
      date: expense.date,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = () => {
    const { description, categoryId, amount, date } = editData;

    if (!description || !categoryId || !amount || !date) {
      setConfirmModal({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please fill in all fields before saving.',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat.id === Number(categoryId)
    );

    if (!selectedCategory) {
      setConfirmModal({
        type: 'warning',
        title: 'Invalid Category',
        message: 'The selected category is invalid. Please choose a valid category.',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    onUpdate?.(editingId, {
      description,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      amount: Number(amount),
      date,
    });

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const getCategoryName = (expense) => {
    const currentCategory = categories.find(
      (cat) => cat.id === expense.categoryId
    );
    return currentCategory ? currentCategory.name : expense.categoryName;
  };

  const handleShareSuccess = () => {
    setConfirmModal({
      type: 'info',
      title: 'Success',
      message: 'Expense shared successfully!',
      confirmText: 'OK',
      onConfirm: () => {}
    });
  };

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
          onClear={() => {
            setSearchQuery("");
            setCurrentPage(1);
          }}
          placeholder="Search by description, amount, or category..."
        />
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No expenses found</p>
          <p className="text-gray-500 text-sm mt-2">Try different search terms</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredExpenses.length)} of {filteredExpenses.length} expenses
          </div>

          <div className="space-y-3">
            {categoriesLoading && (
              <p className="text-gray-500">Loading categories...</p>
            )}

            {paginatedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                {editingId === expense.id ? (
                  <EditForm
                    editData={editData}
                    categories={categories}
                    onChange={handleEditChange}
                    onSave={submitEdit}
                    onCancel={cancelEdit}
                  />
                ) : (
                  <ExpenseItem
                    expense={expense}
                    categoryName={getCategoryName(expense)}
                    onEdit={() => startEdit(expense)}
                    onDelete={() => handleDelete(expense.id)}
                    onUploadReceipt={onUploadReceipt}
                    onDeleteReceipt={onDeleteReceipt}
                    onShare={() => setSharingExpenseId(expense.id)}
                  />
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {hasNext && (
        <div className="flex justify-center pt-6 border-t mt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading more...</span>
              </>
            ) : (
              <>
                <span>Load More from Server</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {sharingExpenseId && (
        <ShareExpenseModal
          expenseId={sharingExpenseId}
          onClose={() => setSharingExpenseId(null)}
          onSuccess={handleShareSuccess}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={() => {
            if (confirmModal.type === 'delete') {
              onDelete?.(confirmModal.id);
            } else if (confirmModal.onConfirm) {
              confirmModal.onConfirm();
            }
          }}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          type={confirmModal.type === 'delete' ? 'danger' : confirmModal.type}
        />
      )}
    </>
  );
};// src/entities/expense/model/hooks.js
import { useState, useEffect } from "react";
import { expenseApi } from "./api";
import { getActiveAccount } from "../../../shared/lib/multiAccountStorage";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  useEffect(() => {
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (token) {
      fetchExpenses();
    }
  }, []);

  const showError = (title, message) => {
    setError(message);
    setErrorModal({
      title,
      message,
      type: 'danger'
    });
  };

  const clearErrorModal = () => {
    setErrorModal(null);
  };

  const fetchExpenses = async (cursor = null, limit = 20) => {
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (!token) {
      console.log("No auth token, skipping expenses fetch");
      return;
    }

    setLoading(true);
    try {
      const data = await expenseApi.getAll({ cursor, limit });

      const expensesToProcess = data.items || [];

      const expensesWithReceipts = await Promise.all(
        expensesToProcess.map(async (exp) => {
          try {
            const receipt = await expenseApi.getReceipt(exp.id);
            return { ...exp, receiptUrl: receipt || null };
          } catch {
            return { ...exp, receiptUrl: null };
          }
        })
      );

      if (cursor) {
        setExpenses((prev) => [...prev, ...expensesWithReceipts.filter(Boolean)]);
      } else {
        setExpenses(expensesWithReceipts.filter(Boolean));
      }

      setHasNext(data.hasNext || false);
      setNextCursor(data.nextCursor || null);
      setError(null);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        const message = err.response?.data?.message || err.message || "Failed to fetch expenses";
        showError("Error Loading Expenses", message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNext && nextCursor && !loading) {
      fetchExpenses(nextCursor);
    }
  };

  const addExpense = async (expense) => {
    try {
      const data = await expenseApi.create(expense);
      setExpenses((prev) => [{ ...data, receiptUrl: null }, ...prev]);
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to add expense";
      showError("Failed to Add Expense", message);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseApi.delete(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to delete expense";
      showError("Failed to Delete Expense", message);
      throw err;
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    try {
      const data = await expenseApi.update(id, updatedExpense);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? { ...data, receiptUrl: exp.receiptUrl } : exp))
      );
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to update expense";
      showError("Failed to Update Expense", message);
      throw err;
    }
  };

  const uploadReceipt = async (expenseId, file) => {
    try {
      await expenseApi.uploadReceipt(expenseId, file);
      const receipt = await expenseApi.getReceipt(expenseId);
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expenseId ? { ...exp, receiptUrl: receipt } : exp
        )
      );
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to upload receipt";
      showError("Failed to Upload Receipt", message);
      throw err;
    }
  };

  const deleteReceipt = async (expenseId) => {
    try {
      await expenseApi.deleteReceipt(expenseId);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === expenseId ? { ...exp, receiptUrl: null } : exp))
      );
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to delete receipt";
      showError("Failed to Delete Receipt", message);
      throw err;
    }
  };

  return {
    expenses,
    hasNext,
    loading,
    error,
    errorModal,
    fetchExpenses,
    loadMore,
    addExpense,
    deleteExpense,
    updateExpense,
    uploadReceipt,
    deleteReceipt,
    clearErrorModal,
  };
};// src/entities/expense/model/api.js
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
};// src/entities/category/ui/CategoryForm.jsx
import React, { useState } from "react";
import { useCategories } from "../model/hooks";

export const CategoryForm = ({ onAdd }) => {
  const { categories, loading } = useCategories();
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      await onAdd({ name: newCategory });
      setNewCategory("");
    } catch (err) {
      // Error handled by CategoryProvider and shown in modal
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 bg-white p-4 rounded-lg shadow-md"
    >
      {loading && <p className="text-gray-500">Loading categories...</p>}

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Category
        </button>
      </div>
    </form>
  );
};// src/entities/category/ui/CategoryList.jsx
import React, { useState, useEffect } from "react";
import { useCategories } from "../model/hooks";
import { ConfirmModal } from "../../../shared/ui/ConfirmModal";

export const CategoryList = ({ onUpdate, onDelete }) => {
  const { categories, errorModal, clearErrorModal } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);
  const [localErrorModal, setLocalErrorModal] = useState(null);

  // Sync errorModal from context to local state
  useEffect(() => {
    if (errorModal) {
      setLocalErrorModal(errorModal);
    }
  }, [errorModal]);

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No categories yet</p>
        <p className="text-gray-500 text-sm mt-2">Add your first category above</p>
      </div>
    );
  }

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const submitEdit = async () => {
    if (!editName.trim()) {
      setConfirmModal({
        type: 'warning',
        title: 'Empty Category Name',
        message: 'Category name cannot be empty. Please enter a valid name.',
        confirmText: 'OK',
        onConfirm: () => {}
      });
      return;
    }

    try {
      await onUpdate(editingId, { name: editName });
      setEditingId(null);
    } catch (err) {
      // Error handled by provider
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id, name) => {
    setConfirmModal({
      type: 'delete',
      id,
      title: 'Delete Category',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: 'Delete'
    });
  };

  const handleConfirmDelete = async (id) => {
    try {
      await onDelete(id);
      setConfirmModal(null); // Close confirm modal on success
    } catch (err) {
      // Close confirm modal first, then error modal will show
      setConfirmModal(null);
    }
  };

  const handleCloseErrorModal = () => {
    setLocalErrorModal(null);
    clearErrorModal?.();
  };

  return (
    <>
      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {editingId === cat.id ? (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg"
                  placeholder="Category name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitEdit}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-gray-900 text-lg truncate"
                    title={cat.name}
                  >
                    {cat.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {confirmModal && !localErrorModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={() => {
            if (confirmModal.type === 'delete') {
              handleConfirmDelete(confirmModal.id);
            } else if (confirmModal.onConfirm) {
              confirmModal.onConfirm();
            }
          }}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          type={confirmModal.type === 'delete' ? 'danger' : confirmModal.type}
        />
      )}

      {/* Error modal from CategoryProvider */}
      {localErrorModal && (
        <ConfirmModal
          isOpen={!!localErrorModal}
          onClose={handleCloseErrorModal}
          onConfirm={handleCloseErrorModal}
          title={localErrorModal.title}
          message={localErrorModal.message}
          confirmText="OK"
          cancelText=""
          type={localErrorModal.type}
        />
      )}
    </>
  );
};// UI
export { CategoryForm } from './ui/CategoryForm.jsx';
export { CategoryList } from './ui/CategoryList.jsx';

// Model
export { useCategories } from './model/hooks';
// src/entities/category/model/CategoryProvider.jsx
import { useState, useEffect, useMemo } from "react";
import { axiosInstance } from "../../../shared/api/axiosInstance";
import { CategoryContext } from "./CategoryContext";
import { getActiveAccount } from "../../../shared/lib/multiAccountStorage";

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  const fetchCategories = async () => {
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (!token) {
      console.log("No auth token, skipping categories fetch");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/v1/categories");
      setCategories(Array.isArray(data.data) ? data.data : []);
      setError(null);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch categories";
        setError(errorMessage);
        setErrorModal({
          title: 'Error Loading Categories',
          message: errorMessage,
          type: 'danger'
        });
      } else {
        console.log("Auth error while fetching categories, user likely not logged in yet");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (token) {
      fetchCategories();
    }
  }, []);

  const addCategory = async (category) => {
    try {
      const { data } = await axiosInstance.post("/api/v1/categories", category);
      if (data?.data) {
        setCategories((prev) => [...prev, data.data]);
      }
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add category";
      setError(errorMessage);
      setErrorModal({
        title: 'Failed to Add Category',
        message: errorMessage,
        type: 'danger'
      });
      throw err;
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    try {
      const { data } = await axiosInstance.put(`/api/v1/categories/${id}`, updatedCategory);
      if (data?.data) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? data.data : cat))
        );
      }
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update category";
      setError(errorMessage);
      setErrorModal({
        title: 'Failed to Update Category',
        message: errorMessage,
        type: 'danger'
      });
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete category";

      // Special handling for category with expenses
      let message = errorMessage;
      if (err.response?.status === 500 || errorMessage.includes('expense')) {
        message = "Cannot delete this category because it has associated expenses. Please delete or reassign the expenses first.";
      }

      setError(message);
      setErrorModal({
        title: 'Failed to Delete Category',
        message: message,
        type: 'danger'
      });
      throw err;
    }
  };

  const clearErrorModal = () => {
    setErrorModal(null);
  };

  const value = useMemo(() => ({
    categories,
    loading,
    error,
    errorModal,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    clearErrorModal,
  }), [categories, loading, error, errorModal]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};// src/entities/category/model/hooks.js
import { useContext } from "react";
import { CategoryContext } from "./CategoryContext";

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};import { axiosInstance } from "../../../shared/api/axiosInstance";

export const categoryApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/api/v1/categories");
    return data.data || [];
  },

  create: async (category) => {
    const { data } = await axiosInstance.post("/api/v1/categories", category);
    return data.data;
  },
};
// src/entities/category/model/CategoryContext.js
import { createContext } from "react";

export const CategoryContext = createContext(null);// src/entities/user/ui/ProfileCard.jsx
import React from "react";

export const ProfileCard = ({ user }) => {
  if (!user) return null;

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {getInitials(user.data.username)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{user.data.username}</h3>
          <p className="text-sm text-gray-600">{user.data.email}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {user.data.id}</p>
        </div>
      </div>
    </div>
  );
};import { useState, useEffect } from "react";
import { axiosInstance } from "../../../shared/api/axiosInstance";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/v1/users/me");
      setUser(data);
    } catch (err) {
      setError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, fetchUser };
};// src/entities/team/ui/TeamList.jsx
import React from "react";
import { TeamCard } from "./TeamCard";

export const TeamList = ({ teams, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-lg">No teams yet</p>
        <p className="text-gray-500 text-sm mt-2">Create your first team to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
};// src/entities/team/ui/TeamCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teams/${team.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {team.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Click to view details
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow">
          {team.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span>View team details</span>
      </div>
    </div>
  );
};export { TeamCard } from './ui/TeamCard';
export { TeamList } from './ui/TeamList';
export { useTeams, useTeamDetails, useTeamExpenses } from './model/hooks';
export { teamApi } from './model/api';// src/entities/team/model/hooks.js
import { useState, useEffect } from "react";
import { teamApi } from "./api";

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await teamApi.getAll();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData) => {
    try {
      const data = await teamApi.create(teamData);
      setTeams((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message || "Failed to create team");
      throw err;
    }
  };

  return {
    teams,
    loading,
    error,
    fetchTeams,
    createTeam,
  };
};

export const useTeamDetails = (teamId) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    setLoading(true);
    try {
      const data = await teamApi.getById(teamId);
      setTeam(data);
    } catch (err) {
      setError(err.message || "Failed to fetch team details");
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData) => {
    try {
      await teamApi.addMember(teamId, memberData);
      await fetchTeamDetails();
    } catch (err) {
      setError(err.message || "Failed to add member");
      throw err;
    }
  };

  const changeMemberRole = async (userId, role) => {
    try {
      await teamApi.changeMemberRole(teamId, userId, role);
      await fetchTeamDetails();
    } catch (err) {
      setError(err.message || "Failed to change member role");
      throw err;
    }
  };

  const removeMember = async (userId) => {
    try {
      await teamApi.removeMember(teamId, userId);
      await fetchTeamDetails();
    } catch (err) {
      setError(err.message || "Failed to remove member");
      throw err;
    }
  };

  return {
    team,
    loading,
    error,
    fetchTeamDetails,
    addMember,
    changeMemberRole,
    removeMember,
  };
};

export const useTeamExpenses = (teamId) => {
  const [expenses, setExpenses] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teamId) {
      fetchExpenses();
    }
  }, [teamId]);

  const fetchExpenses = async (cursor = null, limit = 20) => {
    setLoading(true);
    try {
      const data = await teamApi.getExpenses(teamId, { cursor, limit });

      if (cursor) {
        setExpenses((prev) => [...prev, ...(data.items || [])]);
      } else {
        setExpenses(data.items || []);
      }

      setHasNext(data.hasNext || false);
      setNextCursor(data.nextCursor || null);
    } catch (err) {
      setError(err.message || "Failed to fetch team expenses");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNext && nextCursor && !loading) {
      fetchExpenses(nextCursor);
    }
  };

  const createExpense = async (expenseData) => {
    try {
      const data = await teamApi.createExpense(teamId, expenseData);
      setExpenses((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || "Failed to create team expense");
      throw err;
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      const data = await teamApi.updateExpense(expenseId, expenseData);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === expenseId ? data : exp))
      );
      return data;
    } catch (err) {
      setError(err.message || "Failed to update team expense");
      throw err;
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await teamApi.deleteExpense(expenseId);
      setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
    } catch (err) {
      setError(err.message || "Failed to delete team expense");
      throw err;
    }
  };

  return {
    expenses,
    hasNext,
    nextCursor,
    loading,
    error,
    fetchExpenses,
    loadMore,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};// src/entities/team/model/api.js
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
};export { statsApi } from './model/api';
export { useStats } from './model/hooks';import { useState, useEffect } from "react";
import { statsApi } from "./api";
import { getActiveAccount } from "../../../shared/lib/multiAccountStorage";

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    // Check if user is authenticated before fetching
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (!token) {
      console.log("No auth token, skipping stats fetch");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await statsApi.getStats();
      setStats(data);
    } catch (err) {
      // Only set error if it's not an auth error (401/403)
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError(err.message || "Failed to fetch statistics");
      }
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if authenticated
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (token) {
      fetchStats();
    }
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
import { axiosInstance } from "../../../shared/api/axiosInstance";

export const statsApi = {
  getStats: async () => {
    const { data } = await axiosInstance.get("/api/v1/expenses/filter-service/stats");
    return data.data;
  }
};