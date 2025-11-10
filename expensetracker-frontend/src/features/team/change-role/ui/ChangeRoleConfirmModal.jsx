import React from "react";
import { Modal, Icon } from "@shared/ui";

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
            <Icon name="close" className="w-6 h-6" />
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
              <Icon name="chevronDown" className="w-5 h-5 text-gray-400" />
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

