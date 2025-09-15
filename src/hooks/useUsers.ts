import { useCallback } from 'react';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/services/user.api';
import type { User, UserRole } from '@/types';

interface UserUpdateInput {
  username?: string;
  email?: string;
  image?: File | string;
  role?: string;
  isActive?: boolean;
}

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export const useUsers = () => {
  // Queries
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  // Mutations
  const [updateUserMutation, { isLoading: isUpdating }] =
    useUpdateUserMutation();
  const [deleteUserMutation, { isLoading: isDeleting }] =
    useDeleteUserMutation();

  // Computed values
  const users = usersData?.data || [];
  const isLoading = isLoadingUsers || isUpdating || isDeleting;

  // Helper function to convert data to FormData if needed
  const createFormData = useCallback(
    (data: UserUpdateInput): FormData | Partial<User> => {
      // Check if we have a file to upload
      const hasFile = data.image && data.image instanceof File;

      if (hasFile) {
        const formData = new FormData();

        // Add text fields
        if (data.username) formData.append('username', data.username);
        if (data.email) formData.append('email', data.email);
        if (data.role) formData.append('role', data.role);
        if (data.isActive !== undefined)
          formData.append('isActive', data.isActive.toString());

        // Add image file
        if (data.image instanceof File) {
          formData.append('image', data.image);
        }

        return formData;
      } else {
        // Return as regular object for JSON
        return {
          username: data.username,
          email: data.email,
          role: data.role as UserRole,
          isActive: data.isActive,
          image: typeof data.image === 'string' ? data.image : undefined,
        };
      }
    },
    []
  );

  // Actions
  const updateUser = useCallback(
    async (id: number, data: UserUpdateInput) => {
      try {
        const requestData = createFormData(data);
        const result = await updateUserMutation({
          id,
          data: requestData,
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
          'Failed to update user';
        return { success: false, error: errorMessage };
      }
    },
    [updateUserMutation, createFormData]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      try {
        const result = await deleteUserMutation(id).unwrap();

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
          'Failed to delete user';
        return { success: false, error: errorMessage };
      }
    },
    [deleteUserMutation]
  );

  const toggleUserStatus = useCallback(
    async (id: number, isActive: boolean) => {
      return updateUser(id, { isActive });
    },
    [updateUser]
  );

  const updateUserRole = useCallback(
    async (id: number, role: string) => {
      return updateUser(id, { role });
    },
    [updateUser]
  );

  return {
    // Data
    users,
    isLoading,
    error: usersError,

    // Actions
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateUserRole,
    refetchUsers,

    // Loading states
    isUpdating,
    isDeleting,
  };
};
