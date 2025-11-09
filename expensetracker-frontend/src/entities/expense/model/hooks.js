// src/entities/expense/model/hooks.js
import { useState, useEffect } from "react";
import { expenseApi } from "./api";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async (cursor = null, limit = 20) => {
    setLoading(true);
    try {
      const data = await expenseApi.getAll({ cursor, limit });

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

      // Якщо це перше завантаження або перезавантаження - замінюємо
      // Якщо це "Load More" - додаємо до існуючих
      if (cursor) {
        setExpenses((prev) => [...prev, ...expensesWithReceipts.filter(Boolean)]);
      } else {
        setExpenses(expensesWithReceipts.filter(Boolean));
      }

      setHasNext(data.hasNext || false);
      setNextCursor(data.nextCursor || null);
    } catch (err) {
      setError(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNext && nextCursor && !loading) {
      fetchExpenses(nextCursor);
    }
  };

  const addExpense = async (expense) => {
    try {
      const data = await expenseApi.create(expense);
      setExpenses((prev) => [{ ...data, receiptUrl: null }, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to add expense");
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseApi.delete(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete expense");
      throw err;
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
      throw err;
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
    hasNext,
    nextCursor,
    loading,
    error,
    fetchExpenses,
    loadMore,
    addExpense,
    deleteExpense,
    updateExpense,
    uploadReceipt,
    deleteReceipt,
  };
};