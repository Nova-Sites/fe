import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, Product, ProductFilters, PaginatedResponse } from '@/types';
import { API_ROUTES } from '@/constants';
import { createBaseQuery } from './api.config';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, ProductFilters>({
      query: (filters) => ({
        url: API_ROUTES.PRODUCTS.GET_ALL,
        method: API_ROUTES.PRODUCTS.METHODS.GET_ALL,
        params: filters,
        contentType: 'json',
      }),
      providesTags: ['Product'],
    }),
    getProductBySlug: builder.query<ApiResponse<Product>, string>({
      query: (slug) => ({
        url: `${API_ROUTES.PRODUCTS.GET_BY_SLUG}/${slug}`,
        method: API_ROUTES.PRODUCTS.METHODS.GET_BY_SLUG,
        contentType: 'json',
      }),
      providesTags: (_result, _error, slug) => [{ type: 'Product', id: slug }],
    }),
    getPopularProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => ({
        url: API_ROUTES.PRODUCTS.POPULAR,
        method: API_ROUTES.PRODUCTS.METHODS.POPULAR,
        contentType: 'json',
      }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<ApiResponse<Product>, Partial<Product>>({
      query: (data) => ({
        url: API_ROUTES.PRODUCTS.CREATE,
        method: API_ROUTES.PRODUCTS.METHODS.CREATE,
        body: data,
        contentType: 'json',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<ApiResponse<Product>, { id: number; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.PRODUCTS.UPDATE}/${id}`,
        method: API_ROUTES.PRODUCTS.METHODS.UPDATE,
        body: data,
        contentType: 'json',
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `${API_ROUTES.PRODUCTS.DELETE}/${id}`,
        method: API_ROUTES.PRODUCTS.METHODS.DELETE,
        contentType: 'json',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetPopularProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
