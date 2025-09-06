import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  ApiResponse,
  Product,
  ProductFilters,
  PaginatedResponse,
} from '@/types';
import { API_ROUTES, API_METHODS } from '@/constants';
import { createBaseQuery } from './api.config';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Product'],
  endpoints: builder => ({
    getProducts: builder.query<PaginatedResponse<Product>, ProductFilters>({
      query: filters => ({
        url: API_ROUTES.PRODUCTS.GET_ALL,
        method: API_METHODS.GET,
        params: filters,
        contentType: 'json',
      }),
      providesTags: ['Product'],
    }),
    getProductBySlug: builder.query<ApiResponse<Product>, string>({
      query: slug => ({
        url: `${API_ROUTES.PRODUCTS.GET_BY_SLUG}/${slug}`,
        method: API_METHODS.GET,
        contentType: 'json',
      }),
      providesTags: (_result, _error, slug) => [{ type: 'Product', id: slug }],
    }),
    getPopularProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => ({
        url: API_ROUTES.PRODUCTS.POPULAR,
        method: API_METHODS.GET,
        contentType: 'json',
      }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<ApiResponse<Product>, Partial<Product>>({
      query: data => ({
        url: API_ROUTES.PRODUCTS.CREATE,
        method: API_METHODS.POST,
        body: data,
        contentType: 'json',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: number; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.PRODUCTS.UPDATE}/${id}`,
        method: API_METHODS.PUT,
        body: data,
        contentType: 'json',
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<ApiResponse<null>, number>({
      query: id => ({
        url: `${API_ROUTES.PRODUCTS.DELETE}/${id}`,
        method: API_METHODS.DELETE,
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
