import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, Category } from '@/types';
import { API_ROUTES, API_METHODS } from '@/constants';
import { createBaseQuery } from './api.config';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Category'],
  endpoints: builder => ({
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({
        url: API_ROUTES.CATEGORIES.GET_ALL,
        method: API_METHODS.GET,
        contentType: 'json',
      }),
      providesTags: ['Category'],
    }),
    getCategoryBySlug: builder.query<ApiResponse<Category>, string>({
      query: slug => ({
        url: `${API_ROUTES.CATEGORIES.GET_BY_SLUG}/${slug}`,
        method: API_METHODS.GET,
        contentType: 'json',
      }),
      providesTags: (_result, _error, slug) => [{ type: 'Category', id: slug }],
    }),
    createCategory: builder.mutation<ApiResponse<Category>, Partial<Category>>({
      query: data => ({
        url: API_ROUTES.CATEGORIES.CREATE,
        method: API_METHODS.POST,
        body: data,
        contentType: 'json',
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { id: number; data: Partial<Category> }
    >({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.CATEGORIES.UPDATE}/${id}`,
        method: API_METHODS.PUT,
        body: data,
        contentType: 'json',
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<ApiResponse<null>, number>({
      query: id => ({
        url: `${API_ROUTES.CATEGORIES.DELETE}/${id}`,
        method: API_METHODS.DELETE,
        contentType: 'json',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
