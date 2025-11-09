import React, { useState, useEffect, useRef, useMemo } from "react";
import { useCategories } from "@entities/category";
import { SearchInput, Icon, ConfirmModal, Toast } from "@shared/ui";
import { TeamExpensesFilter } from "./TeamExpensesFilter";
import { useToast } from "@shared/hooks/useToast";

const ScrollToTopButton = ({ onClick, show }) => {
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
};

export const TeamExpensesList = ({ expenses, hasNext, onLoadMore, loading, onUpdate, onDelete }) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    description: "",
    categoryId: "",
    amount: "",
    date: "",
  });

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const listTopRef = useRef(null);
  const { toast, showError, hideToast } = useToast();

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

  const filteredExpenses = useMemo(() => {
    let result = expenses;

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((e) =>
        e.description?.toLowerCase().includes(searchLower) ||
        e.categoryName?.toLowerCase().includes(searchLower) ||
        e.amount?.toString().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.categoryId) {
      result = result.filter((e) => e.categoryId === filters.categoryId);
    }

    // Apply date range filter
    if (filters.fromDate) {
      result = result.filter((e) => {
        const expenseDate = new Date(e.date);
        const fromDate = new Date(filters.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        return expenseDate >= fromDate;
      });
    }

    if (filters.toDate) {
      result = result.filter((e) => {
        const expenseDate = new Date(e.date);
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        return expenseDate <= toDate;
      });
    }

    // Apply amount range filter
    if (filters.minAmount !== undefined) {
      result = result.filter((e) => e.amount >= filters.minAmount);
    }

    if (filters.maxAmount !== undefined) {
      result = result.filter((e) => e.amount <= filters.maxAmount);
    }

    return result;
  }, [expenses, search, filters]);

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon name="receipt" className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-400 text-lg">No team expenses yet</p>
        <p className="text-gray-500 text-sm mt-2">Create your first team expense</p>
      </div>
    );
  }

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

  const submitEdit = async () => {
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

    try {
      await onUpdate(editingId, {
        description,
        categoryId: selectedCategory.id,
        amount: Number(amount),
        date,
      });
      setEditingId(null);
    } catch (err) {
      showError(err.message || "Failed to update expense");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ id });
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await onDelete(deleteConfirm.id);
        setDeleteConfirm(null);
      } catch (err) {
        showError(err.message || "Failed to delete expense");
        setDeleteConfirm(null);
      }
    }
  };

  return (
    <>
      <div ref={listTopRef} className="space-y-4">
        {/* Filter Panel - expands above the content */}
        <TeamExpensesFilter
          filters={filters}
          onFiltersChange={setFilters}
          onReset={() => setFilters({})}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Search..."
            />
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No expenses found</p>
            <p className="text-gray-500 text-sm mt-2">
              {search.trim() || Object.keys(filters).length > 0
                ? "Try different search terms or filters"
                : "Create your first team expense"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingId === expense.id ? (
                    <div className="flex flex-col gap-3">
                      <input
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-3 rounded-lg"
                        placeholder="Description"
                      />
                      <select
                        name="categoryId"
                        value={editData.categoryId}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-3 rounded-lg"
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
                        step="0.01"
                        name="amount"
                        value={editData.amount}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-3 rounded-lg"
                        placeholder="Amount"
                      />
                      <input
                        type="date"
                        name="date"
                        value={editData.date}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-3 rounded-lg"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={submitEdit}
                          type="button"
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          type="button"
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {expense.description}
                          </h3>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {expense.categoryName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{expense.date}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${expense.amount}</p>
                        </div>

                        <button
                          onClick={() => startEdit(expense)}
                          type="button"
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Icon name="edit" className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleDelete(expense.id)}
                          type="button"
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

            {/* Load More Button */}
            {hasNext && (
              <div className="flex justify-center pt-4">
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
                      <Icon name="chevronDown" className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton onClick={scrollToTop} show={showScrollTop} />

      {deleteConfirm && (
        <ConfirmModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={confirmDelete}
          title="Delete Team Expense"
          message="Are you sure you want to delete this team expense?"
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