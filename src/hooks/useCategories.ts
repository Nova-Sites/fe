import { useCallback } from 'react';
import {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/services/category.api';
import { CategoryCreateInput } from '@/utils/validation/schemas';

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export const useCategories = () => {
  // Queries
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();

  // Mutations
  const [createCategoryMutation, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategoryMutation, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategoryMutation, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // Computed values
  const categories = categoriesData?.data || [];
  const isLoading =
    isLoadingCategories || isCreating || isUpdating || isDeleting;

  // Helper function to convert data to FormData
  const createFormData = useCallback((data: CategoryCreateInput): FormData => {
    const formData = new FormData();

    // Add text fields
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('description', data.description);

    // Handle image file
    if (data.image) {
      if (data.image instanceof File) {
        formData.append('image', data.image);
      } else if (typeof data.image === 'string' && data.image.trim()) {
        // If it's a string (existing image URL), we might not need to send it
        // or handle it differently based on your API requirements
        formData.append('image', data.image);
      }
    }

    return formData;
  }, []);

  // Actions
  const createCategory = useCallback(
    async (data: CategoryCreateInput) => {
      try {
        const formData = createFormData(data);
        const result = await createCategoryMutation(formData).unwrap();

        if (result.success) {
          return { success: true, data: result.data };
        } else {
          return { success: false, error: result.message };
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.data?.message ||
          apiError?.message ||
          'Failed to create category';
        return { success: false, error: errorMessage };
      }
    },
    [createCategoryMutation, createFormData]
  );

  const updateCategory = useCallback(
    async (id: number, data: CategoryCreateInput) => {
      try {
        const formData = createFormData(data);
        const result = await updateCategoryMutation({
          id,
          data: formData,
        }).unwrap();

        if (result.success) {
          return { success: true, data: result.data };
        } else {
          return { success: false, error: result.message };
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.data?.message ||
          apiError?.message ||
          'Failed to update category';
        return { success: false, error: errorMessage };
      }
    },
    [updateCategoryMutation, createFormData]
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      try {
        const result = await deleteCategoryMutation(id).unwrap();

        if (result.success) {
          return { success: true };
        } else {
          return { success: false, error: result.message };
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.data?.message ||
          apiError?.message ||
          'Failed to delete category';
        return { success: false, error: errorMessage };
      }
    },
    [deleteCategoryMutation]
  );

  return {
    // Data
    categories,
    isLoading,
    error: categoriesError,

    // Actions
    createCategory,
    updateCategory,
    deleteCategory,
    refetchCategories,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
};

export const useCategory = (slug: string) => {
  const {
    data: categoryData,
    isLoading,
    error,
    refetch,
  } = useGetCategoryBySlugQuery(slug, {
    skip: !slug,
  });

  return {
    category: categoryData?.data || null,
    isLoading,
    error,
    refetch,
  };
};
