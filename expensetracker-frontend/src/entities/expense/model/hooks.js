import { useState, useEffect } from "react";
import { expenseApi } from "./api";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

const fetchExpenses = async () => {
  setLoading(true);
  try {
    const data = await expenseApi.getAll();

    const expensesToProcess = data.items || [];

    const expensesWithReceipts = await Promise.all(
      expensesToProcess.map(async (exp) => {
        try {
          const receipt = await expenseApi.getReceipt(exp.id);
          return { ...exp, receiptUrl: receipt || null };
        } catch {
          return { ...exp, receiptUrl: null };
        }
      })
    );

    setExpenses(expensesWithReceipts.filter(Boolean));
  } catch (err) {
    setError(err.message || "Failed to fetch expenses");
  } finally {
    setLoading(false);
  }
};

  const addExpense = async (expense) => {
    try {
      const data = await expenseApi.create(expense);
      setExpenses((prev) => [...prev, { ...data, receiptUrl: null }]);
    } catch (err) {
      setError(err.message || "Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseApi.delete(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete expense");
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    try {
      const data = await expenseApi.update(id, updatedExpense);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? { ...data, receiptUrl: exp.receiptUrl } : exp))
      );
    } catch (err) {
      setError(err.message || "Failed to update expense");
    }
  };

  const uploadReceipt = async (expenseId, file) => {
    try {
      await expenseApi.uploadReceipt(expenseId, file);
      const receipt = await expenseApi.getReceipt(expenseId);
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expenseId ? { ...exp, receiptUrl: receipt } : exp
        )
      );
    } catch (err) {
      setError(err.message || "Failed to upload receipt");
      throw err;
    }
  };

  const deleteReceipt = async (expenseId) => {
    try {
      await expenseApi.deleteReceipt(expenseId);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === expenseId ? { ...exp, receiptUrl: null } : exp))
      );
    } catch (err) {
      setError(err.message || "Failed to delete receipt");
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    deleteExpense,
    updateExpense,
    uploadReceipt,
    deleteReceipt,
  };
};
