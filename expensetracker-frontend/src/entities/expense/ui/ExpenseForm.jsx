import React, { useState, useCallback, memo } from "react";
import { useCategories } from "@entities/category";
import { useToast } from "@shared/hooks/useToast";
import { Toast } from "@shared/ui";
import { validateForm, validators } from "@shared/lib";

export const ExpenseForm = memo(({ onAdd }) => {
  const { categories, loading } = useCategories();
  const { toast, showError, hideToast } = useToast();

  const [expense, setExpense] = useState({
    categoryId: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const formData = {
      categoryId: expense.categoryId,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
    };

    const validationRules = {
      categoryId: [
        validators.required('Category is required'),
      ],
      description: [
        validators.required('Description is required'),
        validators.minLength(3)('Description must be at least 3 characters'),
      ],
      amount: [
        validators.required('Amount is required'),
        validators.positiveNumber('Amount must be a positive number'),
      ],
      date: [
        validators.required('Date is required'),
        validators.date('Invalid date format'),
        validators.notFuture('Date cannot be in the future'),
      ],
    };

    const { errors: validationErrors, isValid } = validateForm(formData, validationRules);

    if (!isValid) {
      setErrors(validationErrors);
      showError(Object.values(validationErrors)[0]);
      return;
    }

    setErrors({});

    const selectedCategory = categories.find(cat => cat.id === Number(expense.categoryId));

    try {
      await onAdd({
        categoryId: selectedCategory?.id,
        categoryName: selectedCategory?.name,
        description: expense.description,
        amount: Number(expense.amount),
        date: expense.date,
      });

      setExpense({
        categoryId: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      setErrors({});
    } catch (err) {
    }
  }, [expense, categories, onAdd, showError]);

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 bg-white p-4 rounded shadow"
    >
      {loading && <p className="text-gray-500">Loading categories...</p>}

      <div>
        <select
          value={expense.categoryId}
          onChange={(e) => {
            setExpense({ ...expense, categoryId: e.target.value });
            if (errors.categoryId) setErrors({ ...errors, categoryId: null });
          }}
          className={`border p-2 rounded w-full ${
            errors.categoryId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Description"
          value={expense.description}
          onChange={(e) => {
            setExpense({ ...expense, description: e.target.value });
            if (errors.description) setErrors({ ...errors, description: null });
          }}
          className={`border p-2 rounded w-full ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={expense.amount}
          onChange={(e) => {
            setExpense({ ...expense, amount: e.target.value });
            if (errors.amount) setErrors({ ...errors, amount: null });
          }}
          className={`border p-2 rounded w-full ${
            errors.amount ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      <div>
        <input
          type="date"
          value={expense.date}
          onChange={(e) => {
            setExpense({ ...expense, date: e.target.value });
            if (errors.date) setErrors({ ...errors, date: null });
          }}
          className={`border p-2 rounded w-full ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Expense
      </button>
      <Toast
        isOpen={toast.isOpen}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </form>
  );
});
ExpenseForm.displayName = 'ExpenseForm';