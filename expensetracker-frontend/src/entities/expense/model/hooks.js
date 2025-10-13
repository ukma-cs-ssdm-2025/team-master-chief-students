import { useState, useEffect } from "react";
import { axiosInstance } from "../../../shared/api/axiosInstance";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/v1/expenses");
      setExpenses(data);
    } catch (err) {
      setError(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense) => {
    try {
      const { data } = await axiosInstance.post("/api/v1/expenses", expense);
      setExpenses((prev) => [...prev, data]);
    } catch (err) {
      setError(err.message || "Failed to add expense");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, loading, error, fetchExpenses, addExpense };
};
