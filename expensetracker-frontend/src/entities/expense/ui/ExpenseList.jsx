import React, { useState } from "react";
import { useCategories } from "../../category/model/hooks";
import { ReceiptUpload } from "../../../features/expense/receipt/ui/ReceiptUpload";
import { ReceiptViewer } from "../../../features/expense/receipt/ui/ReceiptViewer";

const INITIAL_EDIT_DATA = {
  description: "",
  categoryId: "",
  amount: "",
  date: "",
};

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
  onDeleteReceipt
}) => {
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">
              {expense.description}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {categoryName}
            </span>
          </div>
          <p className="text-sm text-gray-500">{expense.date}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${expense.amount}</p>
          </div>

          {/* Receipt Toggle Button */}
          <button
            onClick={() => setShowReceipt(!showReceipt)}
            type="button"
            className={`p-2 rounded-lg transition-colors ${
              showReceipt || expense.receiptUrl
                ? 'text-green-500 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={expense.receiptUrl ? "View receipt" : "Add receipt"}
            aria-label="Toggle receipt"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>

          <button
            onClick={onEdit}
            type="button"
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
            aria-label="Edit expense"
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
            onClick={onDelete}
            type="button"
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
            aria-label="Delete expense"
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

      {/* Receipt Section */}
      {showReceipt && (
        <div className="border-t pt-4 mt-4 animate-fadeIn">
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

export const ExpenseList = ({
  expenses = [],
  onDelete,
  onUpdate,
  onUploadReceipt,
  onDeleteReceipt
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(INITIAL_EDIT_DATA);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      onDelete?.(id);
    }
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

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {categoriesLoading && (
        <p className="text-gray-500">Loading categories...</p>
      )}

      {expenses.map((expense) => (
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
            />
          )}
        </div>
      ))}
    </div>
  );
};