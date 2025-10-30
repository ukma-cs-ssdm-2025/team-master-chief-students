// src/entities/expense/model/hooks.js
import { useState, useEffect } from "react";
import { axiosInstance } from "../../../shared/api/axiosInstance";

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
      const { data } = await axiosInstance.get("/api/v1/expenses");
      setExpenses(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense) => {
    try {
      const { data } = await axiosInstance.post("/api/v1/expenses", expense);
      if (data?.data) {
        setExpenses((prev) => [...prev, data.data]);
      }
    } catch (err) {
      setError(err.message || "Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete expense");
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    try {
      const { data } = await axiosInstance.put(`/api/v1/expenses/${id}`, updatedExpense);
      if (data?.data) {
        setExpenses((prev) =>
          prev.map((exp) => (exp.id === id ? data.data : exp))
        );
      }
    } catch (err) {
      setError(err.message || "Failed to update expense");
    }
  };

  return { expenses, loading, error, fetchExpenses, addExpense, deleteExpense, updateExpense };
};
