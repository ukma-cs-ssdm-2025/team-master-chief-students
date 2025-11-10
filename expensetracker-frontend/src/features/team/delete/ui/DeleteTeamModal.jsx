// src/features/team/delete/ui/DeleteTeamModal.jsx
import React, { useState } from "react";
import { Modal, Icon } from "@shared/ui";
import { logger } from "@shared/lib";

export const DeleteTeamModal = ({ isOpen, onClose, onConfirm, teamName }) => {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const isConfirmed = confirmText === teamName;

  const handleConfirm = async () => {
    if (!isConfirmed) return;

    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      logger.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Icon name="exclamation" className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Team</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={deleting}
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            This action <span className="font-semibold text-red-600">cannot be undone</span>. This will permanently delete the team{" "}
            <span className="font-semibold text-gray-900">"{teamName}"</span> and remove all associated data including:
          </p>

          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 mb-4">
            <li>All team expenses</li>
            <li>All team members</li>
            <li>Team settings and configuration</li>
          </ul>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> All team members will lose access to this team and its data.
            </p>
          </div>

          <div>
            <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
              Please type <span className="font-bold text-gray-900">{teamName}</span> to confirm:
            </label>
            <input
              id="confirmText"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={teamName}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={deleting}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed || deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Icon name="delete" className="w-5 h-5" />
                <span>Delete Team</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};