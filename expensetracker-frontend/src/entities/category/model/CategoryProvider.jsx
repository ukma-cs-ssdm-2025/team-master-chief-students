import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryContext } from "./CategoryContext";
import { getAuthToken } from "@shared/lib";
import {
  useCategoriesQuery,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./useCategoryQueries";

export const CategoryProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [errorModal, setErrorModal] = useState(null);

  const { data: categories = [], isLoading: loading, error, refetch: fetchCategories } = useCategoriesQuery();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" || e.key === "activeAccountId") {
        const token = getAuthToken();
        if (token) {
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        } else {
          queryClient.setQueryData(['categories'], []);
        }
      }
    };

    const handleTokenUpdate = () => {
      const token = getAuthToken();
      if (token) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      } else {
        queryClient.setQueryData(['categories'], []);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenUpdated", handleTokenUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenUpdated", handleTokenUpdate);
    };
  }, [queryClient]);

  const addCategory = async (category) => {
    try {
      const result = await createMutation.mutateAsync(category);
      setErrorModal(null);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add category";
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
      const result = await updateMutation.mutateAsync({ id, category: updatedCategory });
      setErrorModal(null);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update category";
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
      await deleteMutation.mutateAsync(id);
      setErrorModal(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete category";

      let message = errorMessage;
      if (err.response?.status === 500 || errorMessage.includes('expense')) {
        message = "Cannot delete this category because it has associated expenses. Please delete or reassign the expenses first.";
      }

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

  const errorMessage = error?.response?.data?.message || error?.message || null;

  const value = useMemo(() => ({
    categories,
    loading,
    error: errorMessage,
    errorModal,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    clearErrorModal,
  }), [categories, loading, errorMessage, errorModal]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};