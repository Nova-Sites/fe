import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, LoginCredentials, RegisterData, User } from '@/types';
import { API_ROUTES } from '@/constants';
import { createBaseQuery } from './api.config';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string; expiresIn: number } }>, LoginCredentials>({
      query: (credentials) => ({
        url: API_ROUTES.AUTH.LOGIN,
        method: API_ROUTES.AUTH.METHODS.LOGIN,
        body: credentials,
        contentType: 'json',
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<ApiResponse<{ user: User }>, RegisterData>({
      query: (data) => ({
        url: API_ROUTES.AUTH.REGISTER,
        method: API_ROUTES.AUTH.METHODS.REGISTER,
        body: data,
        contentType: 'json',
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: API_ROUTES.AUTH.LOGOUT,
        method: API_ROUTES.AUTH.METHODS.LOGOUT,
        contentType: 'json',
      }),
      invalidatesTags: ['Auth'],
    }),
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: API_ROUTES.USERS.PROFILE, // Sử dụng USERS.PROFILE đúng với backend
        method: API_ROUTES.USERS.METHODS.GET_PROFILE,
        contentType: 'json',
      }),
      providesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<ApiResponse<{ user: User; tokens: { accessToken: string; refreshToken: string; expiresIn: number } }>, void>({
      query: () => ({
        url: API_ROUTES.AUTH.REFRESH_TOKEN,
        method: API_ROUTES.AUTH.METHODS.REFRESH_TOKEN,
        contentType: 'json',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
} = authApi;
