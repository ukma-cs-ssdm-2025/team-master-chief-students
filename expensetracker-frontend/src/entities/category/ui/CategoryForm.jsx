// src/entities/category/ui/CategoryForm.jsx
import React, { useState } from "react";
import { useCategories } from "../model/hooks";

export const CategoryForm = ({ onAdd }) => {
  const { categories, loading, error } = useCategories();
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      alert("Please enter a category name");
      return;
    }

    onAdd({ name: newCategory });
    setNewCategory("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 bg-white p-4 rounded-lg shadow-md"
    >
      {loading && <p className="text-gray-500">Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

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
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Add Category
        </button>
      </div>
    </form>
  );
};