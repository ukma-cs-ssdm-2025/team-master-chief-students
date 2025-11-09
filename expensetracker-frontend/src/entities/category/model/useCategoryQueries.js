import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from './api';
import { API_ENDPOINTS } from '@shared/config';
import { axiosInstance } from '@shared/api/axiosInstance';
import { getAuthToken, logger } from '@shared/lib';

const CATEGORIES_QUERY_KEY = ['categories'];

export const useCategoriesQuery = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      if (!token) {
        return [];
      }
      const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.BASE);
      return Array.isArray(data.data) ? data.data : [];
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category) => categoryApi.create(category),
    onSuccess: (newCategory) => {
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (old = []) => [...old, newCategory]);
    },
    onError: (error) => {
      logger.error('Failed to create category:', error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, category }) => {
      return axiosInstance.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), category).then(res => res.data.data);
    },
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (old = []) =>
        old.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
      );
    },
    onError: (error) => {
      logger.error('Failed to update category:', error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => {
      return axiosInstance.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (old = []) =>
        old.filter((cat) => cat.id !== deletedId)
      );
    },
    onError: (error) => {
      logger.error('Failed to delete category:', error);
    },
  });
};

