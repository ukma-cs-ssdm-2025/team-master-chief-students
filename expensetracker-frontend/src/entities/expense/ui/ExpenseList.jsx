import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { useCategories } from "@entities/category";
import { ReceiptUpload } from "@features/expense/receipt/ui/ReceiptUpload";
import { ReceiptViewer } from "@features/expense/receipt/ui/ReceiptViewer";
import { ShareExpenseModal } from "@features/team/expenses/ui/ShareExpenseModal";
import { Icon, ConfirmModal, Toast, LoadingSpinner } from "@shared/ui";
import { useToast } from "@shared/hooks/useToast";

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

const EditForm = memo(({ editData, categories, onChange, onSave, onCancel }) => (
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
));
EditForm.displayName = 'EditForm';

const ExpenseItem = memo(({
  expense,
  categoryName,
  onEdit,
  onDelete,
  onUploadReceipt,
  onDeleteReceipt,
  onShare,
  onLoadReceipt,
  isReceiptLoading,
}) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState(expense.receiptUrl);
  const [hasReceipt, setHasReceipt] = useState(expense.hasReceipt || !!expense.receiptUrl);

  React.useEffect(() => {
    if (expense.receiptUrl) {
      setReceiptUrl(expense.receiptUrl);
      setHasReceipt(true);
    }
    if (expense.hasReceipt !== undefined) {
      setHasReceipt(expense.hasReceipt);
    }
  }, [expense.receiptUrl, expense.hasReceipt]);

  const handleShowReceipt = async () => {
    if (!showReceipt) {
      setShowReceipt(true);
      if (!expense.receiptLoaded && !receiptUrl && onLoadReceipt) {
        const url = await onLoadReceipt(expense.id);
        if (url) {
          setReceiptUrl(url);
          setHasReceipt(true);
        }
      }
    } else {
      setShowReceipt(false);
    }
  };

  const handleDeleteReceipt = async (expenseId) => {
    await onDeleteReceipt(expenseId);
    setReceiptUrl(null);
    setHasReceipt(false);
  };

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
            onClick={handleShowReceipt}
            type="button"
            className={`p-2 rounded-lg transition-colors ${
              hasReceipt || receiptUrl
                ? 'text-green-500 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={hasReceipt || receiptUrl ? "View receipt" : "Add receipt"}
            disabled={isReceiptLoading?.(expense.id)}
          >
            {isReceiptLoading?.(expense.id) ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Icon name="receipt" className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={onShare}
            type="button"
            className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
            title="Share to team"
          >
            <Icon name="share" className="h-5 w-5" />
          </button>

          <button
            onClick={onEdit}
            type="button"
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Icon name="edit" className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            type="button"
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Icon name="delete" className="h-5 w-5" />
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
          {receiptUrl || hasReceipt ? (
            <ReceiptViewer
              expenseId={expense.id}
              receiptUrl={receiptUrl || expense.receiptUrl}
              onDelete={handleDeleteReceipt}
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
});
ExpenseItem.displayName = 'ExpenseItem';

const ScrollToTopButton = memo(({ onClick, show }) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      title="Scroll to top"
    >
      <Icon name="chevronUp" className="w-6 h-6" />
    </button>
  );
});
ScrollToTopButton.displayName = 'ScrollToTopButton';

export const ExpenseList = ({
  expenses = [],
  hasNext = false,
  loading = false,
  onDelete,
  onUpdate,
  onUploadReceipt,
  onDeleteReceipt,
  onLoadMore,
  onLoadReceipt,
  isReceiptLoading,
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(INITIAL_EDIT_DATA);
  const [sharingExpenseId, setSharingExpenseId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const listTopRef = useRef(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const filteredExpenses = useMemo(() => expenses, [expenses]);

  const handleDelete = useCallback((id) => {
    setDeleteConfirm({
      id,
      message: "Are you sure you want to delete this expense?",
    });
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteConfirm) {
      onDelete?.(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, onDelete]);

  const startEdit = useCallback((expense) => {
    setEditingId(expense.id);
    setEditData({
      description: expense.description,
      categoryId: expense.categoryId.toString(),
      amount: expense.amount,
      date: expense.date,
    });
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const submitEdit = useCallback(() => {
    const { description, categoryId, amount, date } = editData;

    if (!description || !categoryId || !amount || !date) {
      showError("Please fill all fields");
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat.id === Number(categoryId)
    );

    if (!selectedCategory) {
      showError("Selected category is invalid");
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
  }, [editData, categories, editingId, onUpdate, showError]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditData(INITIAL_EDIT_DATA);
  }, []);

  const getCategoryName = useCallback((expense) => {
    const currentCategory = categories.find(
      (cat) => cat.id === expense.categoryId
    );
    return currentCategory ? currentCategory.name : expense.categoryName;
  }, [categories]);

  const handleShareSuccess = useCallback(() => {
    setSharingExpenseId(null);
    showSuccess("Expense shared successfully!");
  }, [showSuccess]);

  return (
    <>
      <div ref={listTopRef} />

      {loading && expenses.length === 0 ? (
        <LoadingSpinner size="lg" text="Loading expenses..." />
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
              <LoadingSpinner size="sm" text="Updating..." />
            </div>
          )}
          
          <div className="space-y-3">
            {categoriesLoading && (
              <p className="text-gray-500">Loading categories...</p>
            )}

            {filteredExpenses.map((expense) => {
              const categoryName = getCategoryName(expense);
              return (
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
                      categoryName={categoryName}
                      onEdit={() => startEdit(expense)}
                      onDelete={() => handleDelete(expense.id)}
                      onUploadReceipt={onUploadReceipt}
                      onDeleteReceipt={onDeleteReceipt}
                      onShare={() => setSharingExpenseId(expense.id)}
                      onLoadReceipt={onLoadReceipt}
                      isReceiptLoading={isReceiptLoading}
                    />
                  )}
                </div>
              );
            })}
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
                    <LoadingSpinner size="sm" className="text-white" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load More (20)</span>
                    <Icon name="chevronDown" className="w-5 h-5" />
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

      {deleteConfirm && (
        <ConfirmModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={confirmDelete}
          title="Delete Expense"
          message={deleteConfirm.message}
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