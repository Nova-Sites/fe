import { useCallback } from 'react';
import {
  useGetTechStacksQuery,
  useGetTechStackByIdQuery,
  useGetTechStackBySlugQuery,
  useSearchTechStacksQuery,
  useGetTechStacksWithProductCountQuery,
  useCreateTechStackMutation,
  useUpdateTechStackMutation,
  useDeleteTechStackMutation,
} from '@/services/tech-stack.api';
import { TechStackCreateInput } from '@/utils/validation/schemas';

interface ApiError {
  data?: { message?: string };
  message?: string;
}

export const useTechStacksList = (
  filters?: Parameters<typeof useGetTechStacksQuery>[0]
) => {
  const { data, isLoading, error, refetch } = useGetTechStacksQuery(filters);

  return {
    techStacks: data?.data?.techStacks || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refetch,
  };
};

export const useTechStackById = (id?: number) => {
  const { data, isLoading, error, refetch } = useGetTechStackByIdQuery(
    id as number,
    { skip: !id }
  );
  return { techStack: data?.data || null, isLoading, error, refetch };
};

export const useTechStackBySlug = (slug?: string) => {
  const { data, isLoading, error, refetch } = useGetTechStackBySlugQuery(
    slug as string,
    { skip: !slug }
  );
  return { techStack: data?.data || null, isLoading, error, refetch };
};

export const useSearchTechStacks = (search?: string) => {
  const { data, isLoading, error, refetch } = useSearchTechStacksQuery(
    search as string,
    { skip: !search }
  );
  return { techStacks: data?.data || [], isLoading, error, refetch };
};

export const useTechStacksWithProductCount = () => {
  const { data, isLoading, error, refetch } =
    useGetTechStacksWithProductCountQuery();
  return { techStacks: data?.data || [], isLoading, error, refetch };
};

// Strict form-like type to include optional iconUrl
export type TechStackFormLike = TechStackCreateInput & {
  iconUrl?: File | string | null;
};

const createFormData = (data: TechStackFormLike): FormData => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('slug', data.slug);
  if (data.description !== undefined)
    formData.append('description', data.description || '');
  if (data.isActive !== undefined)
    formData.append('isActive', String(data.isActive));

  // Map iconUrl from form to backend field name 'icon'
  const iconValue = data.iconUrl;
  if (iconValue) {
    if (iconValue instanceof File) {
      formData.append('icon', iconValue);
    } else if (typeof iconValue === 'string' && iconValue.trim()) {
      formData.append('icon', iconValue);
    }
  }

  return formData;
};

export const useManageTechStacks = () => {
  const [createMutation, { isLoading: isCreating }] =
    useCreateTechStackMutation();
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateTechStackMutation();
  const [deleteMutation, { isLoading: isDeleting }] =
    useDeleteTechStackMutation();

  const createTechStack = useCallback(
    async (input: TechStackFormLike) => {
      try {
        const formData = createFormData(input);
        const result = await createMutation(formData).unwrap();
        if (result.success) {
          return { success: true, data: result.data } as const;
        }
        return { success: false, error: result.message } as const;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.data?.message ||
          apiError?.message ||
          'Failed to create tech stack';
        return { success: false, error: errorMessage } as const;
      }
    },
    [createMutation]
  );

  const updateTechStack = useCallback(
    async (id: number, input: TechStackFormLike) => {
      try {
        const formData = createFormData(input);
        const result = await updateMutation({ id, formData }).unwrap();
        if (result.success) {
          return { success: true, data: result.data } as const;
        }
        return { success: false, error: result.message } as const;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.data?.message ||
          apiError?.message ||
          'Failed to update tech stack';
        return { success: false, error: errorMessage } as const;
      }
    },
    [updateMutation]
  );

  const deleteTechStack = useCallback(
    async (id: number) => {
      try {
        const result = await deleteMutation(id).unwrap();
        if (result.success) {
          return { success: true } as const;
        }
        return { success: false, error: result.message } as const;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.data?.message ||
          apiError?.message ||
          'Failed to delete tech stack';
        return { success: false, error: errorMessage } as const;
      }
    },
    [deleteMutation]
  );

  return {
    createTechStack,
    updateTechStack,
    deleteTechStack,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
