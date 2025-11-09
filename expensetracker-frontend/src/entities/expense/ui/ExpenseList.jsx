// src/entities/expense/ui/ExpenseList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useCategories } from "../../category/model/hooks";
import { ReceiptUpload } from "../../../features/expense/receipt/ui/ReceiptUpload";
import { ReceiptViewer } from "../../../features/expense/receipt/ui/ReceiptViewer";
import { ShareExpenseModal } from "../../../features/team/expenses/ui/ShareExpenseModal";

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
  onDeleteReceipt,
  onShare,
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

const ScrollToTopButton = ({ onClick, show }) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      title="Scroll to top"
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
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export const ExpenseList = ({
  expenses = [],
  hasNext = false,
  loading = false,
  onDelete,
  onUpdate,
  onUploadReceipt,
  onDeleteReceipt,
  onLoadMore,
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(INITIAL_EDIT_DATA);
  const [sharingExpenseId, setSharingExpenseId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listTopRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Expenses are already filtered by API, no need for local filtering
  const filteredExpenses = expenses;

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

  const handleShareSuccess = () => {
    alert("Expense shared successfully!");
  };

  return (
    <>
      <div ref={listTopRef} />

      {loading && expenses.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(expenses) || expenses.length === 0 ? (
        <EmptyState />
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No expenses found</p>
          <p className="text-gray-500 text-sm mt-2">Try different search terms</p>
        </div>
      ) : (
        <>
          {loading && expenses.length > 0 && (
            <div className="flex items-center justify-center py-4 mb-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-sm text-gray-500">Updating...</span>
            </div>
          )}
          
          <div className="space-y-3">
            {categoriesLoading && (
              <p className="text-gray-500">Loading categories...</p>
            )}

            {filteredExpenses.map((expense) => (
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

          {/* Load More Button */}
          {hasNext && (
            <div className="flex justify-center mt-6">
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load More (20)</span>
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
        </>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTopButton onClick={scrollToTop} show={showScrollTop} />

      {sharingExpenseId && (
        <ShareExpenseModal
          expenseId={sharingExpenseId}
          onClose={() => setSharingExpenseId(null)}
          onSuccess={handleShareSuccess}
        />
      )}
    </>
  );
};