// src/entities/category/model/CategoryProvider.jsx
import { useState, useEffect, useMemo } from "react";
import { axiosInstance } from "../../../shared/api/axiosInstance";
import { CategoryContext } from "./CategoryContext";

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/v1/categories");
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category) => {
    try {
      const { data } = await axiosInstance.post("/api/v1/categories", category);
      if (data?.data) {
        setCategories((prev) => [...prev, data.data]);
      }
    } catch (err) {
      setError(err.message || "Failed to add category");
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    try {
      const { data } = await axiosInstance.put(`/api/v1/categories/${id}`, updatedCategory);
      if (data?.data) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? data.data : cat))
        );
      }
    } catch (err) {
      setError(err.message || "Failed to update category");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  // Використовуємо useMemo, щоб об'єкт value не створювався заново при кожному рендері
  const value = useMemo(() => ({
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  }), [categories, loading, error]); // Залежності

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};