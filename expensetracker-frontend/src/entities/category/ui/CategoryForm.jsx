import React, { useState } from "react";
import { useCategories } from "../model/hooks";
import { useToast } from "@shared/hooks/useToast";
import { Toast } from "@shared/ui";
import { validateForm, validators } from "@shared/lib";

export const CategoryForm = ({ onAdd }) => {
  const { categories, loading } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState(null);
  const { toast, showError, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { name: newCategory };
    const validationRules = {
      name: [
        validators.required('Category name is required'),
        validators.minLength(2)('Category name must be at least 2 characters'),
        validators.maxLength(50)('Category name must be less than 50 characters'),
      ],
    };

    const { errors: validationErrors, isValid } = validateForm(formData, validationRules);

    if (!isValid) {
      setError(validationErrors.name);
      showError(validationErrors.name);
      return;
    }

    setError(null);

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
        <div className="flex-1">
          <input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              if (error) setError(null);
            }}
            className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Category
        </button>
      </div>
      <Toast
        isOpen={toast.isOpen}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </form>
  );
};