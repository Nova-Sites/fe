import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, User } from '@/types';
import { API_ROUTES, API_METHODS } from '@/constants';
import { createBaseQuery } from './api.config';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => ({
        url: API_ROUTES.USERS.GET_ALL,
        method: API_METHODS.GET,
        contentType: 'json',
      }),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<User>, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.USERS.UPDATE_PROFILE}/${id}`,
        method: API_METHODS.PUT,
        body: data,
        contentType: 'json',
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `${API_ROUTES.USERS.DELETE}/${id}`,
        method: API_METHODS.DELETE,
        contentType: 'json',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
