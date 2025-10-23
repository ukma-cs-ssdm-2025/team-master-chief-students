// src/entities/expense/ui/ExpenseList.jsx
import React, { useState } from "react";
import { useCategories } from "../../category/model/hooks";

export const ExpenseList = ({ expenses = [], onDelete, onUpdate }) => {
  const { categories, loading: categoriesLoading } = useCategories();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    description: "",
    categoryId: "",
    amount: "",
    date: "",
  });

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No expenses yet</p>
        <p className="text-gray-500 text-sm mt-2">Add your first expense</p>
      </div>
    );
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      onDelete && onDelete(id);
    }
  };

  const startEdit = (exp) => {
    setEditingId(exp.id);
    setEditData({
      description: exp.description,
      categoryId: exp.categoryId.toString(), // привели до рядка для select
      amount: exp.amount,
      date: exp.date,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = () => {
    if (!editData.description || !editData.categoryId || !editData.amount || !editData.date) {
      alert("Please fill all fields");
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat.id === Number(editData.categoryId)
    );

    if (!selectedCategory) {
      alert("Selected category is invalid");
      return;
    }

    onUpdate &&
      onUpdate(editingId, {
        description: editData.description,
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        amount: Number(editData.amount),
        date: editData.date,
      });

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      {categoriesLoading && <p className="text-gray-500">Loading categories...</p>}

      {expenses.map((exp) => (
        <div
          key={exp.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          {editingId === exp.id ? (
            <div className="flex flex-col gap-2">
              <input
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                className="border p-2 rounded"
                placeholder="Description"
              />
              <select
                name="categoryId"
                value={editData.categoryId}
                onChange={handleEditChange}
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
                onChange={handleEditChange}
                className="border p-2 rounded"
                placeholder="Amount"
              />
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleEditChange}
                className="border p-2 rounded"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={submitEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{exp.description}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {exp.categoryName}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{exp.date}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${exp.amount}</p>
                </div>
                <button
                  onClick={() => startEdit(exp)}
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
                  onClick={() => handleDelete(exp.id)}
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
  );
};