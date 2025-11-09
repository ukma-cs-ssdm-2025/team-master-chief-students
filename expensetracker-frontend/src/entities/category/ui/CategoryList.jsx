// src/entities/category/ui/CategoryList.jsx
import React, { useState, useEffect } from "react";
import { useCategories } from "../model/hooks";
import { ConfirmModal, Icon } from "@shared/ui";

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
                    <Icon name="delete" className="h-5 w-5" />
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
};