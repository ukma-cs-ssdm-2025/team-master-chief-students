import { useState, useEffect, useRef, useCallback } from "react";
import { expenseApi } from "./api";

export const useExpenses = (filters = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(new Set());
  
  const fetchControllerRef = useRef(null);
  const receiptCacheRef = useRef(new Map());

  useEffect(() => {
    return () => {
      receiptCacheRef.current.forEach((url) => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      receiptCacheRef.current.clear();
    };
  }, []);

  const fetchExpenses = useCallback(async (cursor = null, limit = 20) => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    const controller = new AbortController();
    fetchControllerRef.current = controller;

    setLoading(true);
    try {
      const data = await expenseApi.getAll({ cursor, limit, ...filters });

      if (controller.signal.aborted) {
        return;
      }

      const expensesToProcess = data.items || [];

      const expensesWithoutReceipts = expensesToProcess.map((exp) => ({
        ...exp,
        receiptUrl: receiptCacheRef.current.get(exp.id) || null,
        receiptLoaded: receiptCacheRef.current.has(exp.id),
      }));

      if (controller.signal.aborted) {
        return;
      }

      if (cursor) {
        setExpenses((prev) => [...prev, ...expensesWithoutReceipts.filter(Boolean)]);
      } else {
        setExpenses(expensesWithoutReceipts.filter(Boolean));
      }

      setHasNext(data.hasNext || false);
      setNextCursor(data.nextCursor || null);
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setError(err.message || "Failed to fetch expenses");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
    return () => {
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, [fetchExpenses]);

  const loadMore = () => {
    if (hasNext && nextCursor && !loading) {
      fetchExpenses(nextCursor);
    }
  };

  const loadReceipt = async (expenseId) => {
    if (receiptCacheRef.current.has(expenseId)) {
      return receiptCacheRef.current.get(expenseId);
    }

    if (receiptLoading.has(expenseId)) {
      return null;
    }

    setReceiptLoading((prev) => new Set([...prev, expenseId]));

    try {
      const receipt = await expenseApi.getReceipt(expenseId);
      receiptCacheRef.current.set(expenseId, receipt);
      
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expenseId ? { ...exp, receiptUrl: receipt, receiptLoaded: true } : exp
        )
      );
      
      return receipt;
    } catch (err) {
      receiptCacheRef.current.set(expenseId, null);
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expenseId ? { ...exp, receiptUrl: null, receiptLoaded: true } : exp
        )
      );
      return null;
    } finally {
      setReceiptLoading((prev) => {
        const next = new Set(prev);
        next.delete(expenseId);
        return next;
      });
    }
  };

  const addExpense = async (expense) => {
    const optimisticExpense = {
      ...expense,
      id: Date.now(),
      receiptUrl: null,
      receiptLoaded: false,
      _optimistic: true,
    };

    setExpenses((prev) => [optimisticExpense, ...prev]);

    try {
      const data = await expenseApi.create(expense);
      setExpenses((prev) =>
        prev.map((exp) => (exp._optimistic && exp.id === optimisticExpense.id ? { ...data, receiptUrl: null, receiptLoaded: false } : exp))
      );
      return data;
    } catch (err) {
      setExpenses((prev) => prev.filter((exp) => !(exp._optimistic && exp.id === optimisticExpense.id)));
      setError(err.message || "Failed to add expense");
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    const expenseToDelete = expenses.find((exp) => exp.id === id);
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    receiptCacheRef.current.delete(id);

    try {
      await expenseApi.delete(id);
    } catch (err) {
      if (expenseToDelete) {
        setExpenses((prev) => [...prev, expenseToDelete].sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      setError(err.message || "Failed to delete expense");
      throw err;
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    const originalExpense = expenses.find((exp) => exp.id === id);
    const optimisticExpense = {
      ...originalExpense,
      ...updatedExpense,
      _optimistic: true,
    };

    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? optimisticExpense : exp))
    );

    try {
      const data = await expenseApi.update(id, updatedExpense);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? { ...data, receiptUrl: exp.receiptUrl, receiptLoaded: exp.receiptLoaded } : exp))
      );
      return data;
    } catch (err) {
      if (originalExpense) {
        setExpenses((prev) =>
          prev.map((exp) => (exp.id === id ? originalExpense : exp))
        );
      }
      setError(err.message || "Failed to update expense");
      throw err;
    }
  };

  const uploadReceipt = async (expenseId, file) => {
    const previewUrl = URL.createObjectURL(file);
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId ? { ...exp, receiptUrl: previewUrl, receiptLoaded: true, _receiptUploading: true } : exp
      )
    );
    receiptCacheRef.current.set(expenseId, previewUrl);

    try {
      await expenseApi.uploadReceipt(expenseId, file);
      const receipt = await expenseApi.getReceipt(expenseId);
      
      URL.revokeObjectURL(previewUrl);
      
      receiptCacheRef.current.set(expenseId, receipt);
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expenseId ? { ...exp, receiptUrl: receipt, _receiptUploading: false } : exp
        )
      );
    } catch (err) {
      receiptCacheRef.current.delete(expenseId);
      URL.revokeObjectURL(previewUrl);
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === expenseId ? { ...exp, receiptUrl: null, receiptLoaded: false, _receiptUploading: false } : exp
        )
      );
      setError(err.message || "Failed to upload receipt");
      throw err;
    }
  };

  const deleteReceipt = async (expenseId) => {
    const originalReceipt = expenses.find((exp) => exp.id === expenseId)?.receiptUrl;
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === expenseId ? { ...exp, receiptUrl: null } : exp))
    );
    receiptCacheRef.current.delete(expenseId);

    try {
      await expenseApi.deleteReceipt(expenseId);
    } catch (err) {
      if (originalReceipt) {
        receiptCacheRef.current.set(expenseId, originalReceipt);
        setExpenses((prev) =>
          prev.map((exp) => (exp.id === expenseId ? { ...exp, receiptUrl: originalReceipt } : exp))
        );
      }
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
    loadReceipt,
    isReceiptLoading: (id) => receiptLoading.has(id),
  };
};