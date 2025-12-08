// src/features/expense/receipt/ui/ReceiptViewer.jsx
import React, { useState } from 'react';
import { ConfirmModal } from '@shared/ui/ConfirmModal';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useToast } from '@shared/hooks/useToast';
import { Toast } from '@shared/ui/Toast';
import { logger } from '@shared/lib/logger';

export const ReceiptViewer = ({ receiptId, expenseId, onDelete, receiptUrl }) => {
  const [deleting, setDeleting] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast, showError, hideToast } = useToast();

  const handleDelete = async () => {
    const idToDelete = receiptId || expenseId;

    if (!idToDelete) {
      showError('Receipt ID is missing');
      return;
    }

    setDeleting(true);
    try {
      await onDelete(idToDelete);
      setShowDeleteConfirm(false);
    } catch (err) {
      if (err.response?.status === 404) {
        logger.warn('Receipt already deleted');
        setShowDeleteConfirm(false);
        return;
      }
      logger.error('Failed to delete receipt:', err);
      showError('Failed to delete receipt');
    } finally {
      setDeleting(false);
    }
  };

  if (!receiptUrl) {
    return <p className="text-gray-500 italic">Loading receipt...</p>;
  }

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
            title="View fullscreen"
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
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            type="button"
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
            title="Delete receipt"
          >
            {deleting ? (
              <LoadingSpinner size="sm" className="text-white" />
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
            title="Close"
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

      {showDeleteConfirm && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Delete Receipt"
          message="Are you sure you want to delete this receipt? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}

      <Toast
        isOpen={toast.isOpen}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </>
  );
};