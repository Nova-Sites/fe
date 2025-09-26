import { useCallback } from 'react';
import {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetPopularProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetTechStacksQuery,
  useGetProductsByTechStackQuery,
} from '@/services/product.api';
import type { ProductFilters } from '@/types';
import { ProductCreateInput } from '@/utils/validation/schemas';

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export const useProducts = (filters?: ProductFilters) => {
  // Queries
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useGetProductsQuery(filters || {});

  // Mutations
  const [createProductMutation, { isLoading: isCreating }] =
    useCreateProductMutation();
  const [updateProductMutation, { isLoading: isUpdating }] =
    useUpdateProductMutation();
  const [deleteProductMutation, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  // Computed values
  const products = productsData?.data?.items || [];
  const pagination = productsData?.data?.pagination;
  const isLoading = isLoadingProducts || isCreating || isUpdating || isDeleting;

  // Helper function to convert data to FormData
  const createFormData = useCallback((data: ProductCreateInput): FormData => {
    const formData = new FormData();

    // Add text fields
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('description', data.description);
    formData.append('videoUrl', data.videoUrl);
    formData.append('price', data.price.toString());
    formData.append('categoryId', data.categoryId.toString());

    // Handle main image
    if (data.image) {
      if (data.image instanceof File) {
        formData.append('image', data.image);
      } else if (typeof data.image === 'string' && data.image.trim()) {
        formData.append('image', data.image);
      }
    }

    // Handle additional images array
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        if (image instanceof File) {
          formData.append(`images`, image);
        } else if (typeof image === 'string' && image.trim()) {
          formData.append(`images`, image);
        }
      });
    }

    // Handle tech stack IDs
    if (data.techStackIds && data.techStackIds.length > 0) {
      data.techStackIds.forEach(techId => {
        formData.append('techStackIds', techId.toString());
      });
    }

    // Add isActive
    if (data.isActive !== undefined) {
      formData.append('isActive', data.isActive.toString());
    }

    return formData;
  }, []);

  // Actions
  const createProduct = useCallback(
    async (data: ProductCreateInput) => {
      try {
        const formData = createFormData(data);
        const result = await createProductMutation(formData).unwrap();

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
          'Failed to create product';
        return { success: false, error: errorMessage };
      }
    },
    [createProductMutation, createFormData]
  );

  const updateProduct = useCallback(
    async (id: number, data: ProductCreateInput) => {
      try {
        const formData = createFormData(data);
        const result = await updateProductMutation({
          id,
          formData,
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
          'Failed to update product';
        return { success: false, error: errorMessage };
      }
    },
    [updateProductMutation, createFormData]
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        const result = await deleteProductMutation(id).unwrap();

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
          'Failed to delete product';
        return { success: false, error: errorMessage };
      }
    },
    [deleteProductMutation]
  );

  return {
    // Data
    products,
    pagination,
    isLoading,
    error: productsError,

    // Actions
    createProduct,
    updateProduct,
    deleteProduct,
    refetchProducts,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
};

export const useProduct = (slug: string) => {
  const {
    data: productData,
    isLoading,
    error,
    refetch,
  } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });

  return {
    product: productData?.data || null,
    isLoading,
    error,
    refetch,
  };
};

export const usePopularProducts = () => {
  const {
    data: popularProductsData,
    isLoading,
    error,
    refetch,
  } = useGetPopularProductsQuery();

  return {
    popularProducts: popularProductsData?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useTechStacks = (isActive?: boolean) => {
  const {
    data: techStacksData,
    isLoading,
    error,
    refetch,
  } = useGetTechStacksQuery({ isActive });

  return {
    techStacks: techStacksData?.data?.items || [],
    isLoading,
    error,
    refetch,
  };
};

export const useProductsByTechStack = (
  techStackId: number,
  page?: number,
  limit?: number
) => {
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useGetProductsByTechStackQuery(
    { techStackId, page, limit },
    {
      skip: !techStackId,
    }
  );

  return {
    products: productsData?.data?.items || [],
    pagination: productsData?.data?.pagination,
    isLoading,
    error,
    refetch,
  };
};
