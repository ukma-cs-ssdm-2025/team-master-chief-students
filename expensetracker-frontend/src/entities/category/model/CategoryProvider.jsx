// src/entities/category/model/CategoryProvider.jsx
import { useState, useEffect, useMemo } from "react";
import { axiosInstance } from "../../../shared/api/axiosInstance";
import { CategoryContext } from "./CategoryContext";
import { getActiveAccount } from "../../../shared/lib/multiAccountStorage";

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  const fetchCategories = async () => {
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (!token) {
      console.log("No auth token, skipping categories fetch");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/v1/categories");
      setCategories(Array.isArray(data.data) ? data.data : []);
      setError(null);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch categories";
        setError(errorMessage);
        setErrorModal({
          title: 'Error Loading Categories',
          message: errorMessage,
          type: 'danger'
        });
      } else {
        console.log("Auth error while fetching categories, user likely not logged in yet");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (token) {
      fetchCategories();
    }
  }, []);

  const addCategory = async (category) => {
    try {
      const { data } = await axiosInstance.post("/api/v1/categories", category);
      if (data?.data) {
        setCategories((prev) => [...prev, data.data]);
      }
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add category";
      setError(errorMessage);
      setErrorModal({
        title: 'Failed to Add Category',
        message: errorMessage,
        type: 'danger'
      });
      throw err;
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
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update category";
      setError(errorMessage);
      setErrorModal({
        title: 'Failed to Update Category',
        message: errorMessage,
        type: 'danger'
      });
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setError(null);
      setErrorModal(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete category";

      // Special handling for category with expenses
      let message = errorMessage;
      if (err.response?.status === 500 || errorMessage.includes('expense')) {
        message = "Cannot delete this category because it has associated expenses. Please delete or reassign the expenses first.";
      }

      setError(message);
      setErrorModal({
        title: 'Failed to Delete Category',
        message: message,
        type: 'danger'
      });
      throw err;
    }
  };

  const clearErrorModal = () => {
    setErrorModal(null);
  };

  const value = useMemo(() => ({
    categories,
    loading,
    error,
    errorModal,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    clearErrorModal,
  }), [categories, loading, error, errorModal]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};