import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  ApiResponse,
  TechStack,
  TechStackFilters,
  TechStackListData,
} from '@/types';
import { API_ROUTES, API_METHODS } from '@/constants';
import { createBaseQuery } from './api.config';

export const techStackApi = createApi({
  reducerPath: 'techStackApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['TechStack'],
  endpoints: builder => ({
    getTechStacks: builder.query<
      ApiResponse<TechStackListData>,
      TechStackFilters | void
    >({
      query: filters => ({
        url: API_ROUTES.TECH_STACKS.GET_ALL,
        method: API_METHODS.GET,
        params: filters || {},
        contentType: 'json',
      }),
      providesTags: ['TechStack'],
    }),

    getTechStackById: builder.query<ApiResponse<TechStack>, number>({
      query: id => ({
        url: API_ROUTES.TECH_STACKS.GET_BY_ID(id),
        method: API_METHODS.GET,
        contentType: 'json',
      }),
      providesTags: (_result, _error, id) => [{ type: 'TechStack', id }],
    }),

    getTechStackBySlug: builder.query<ApiResponse<TechStack>, string>({
      query: slug => ({
        url: API_ROUTES.TECH_STACKS.GET_BY_SLUG(slug),
        method: API_METHODS.GET,
        contentType: 'json',
      }),
      providesTags: (_result, _error, slug) => [
        { type: 'TechStack', id: slug },
      ],
    }),

    searchTechStacks: builder.query<ApiResponse<TechStack[]>, string>({
      query: search => ({
        url: API_ROUTES.TECH_STACKS.SEARCH,
        method: API_METHODS.GET,
        params: { search },
        contentType: 'json',
      }),
      providesTags: ['TechStack'],
    }),

    getTechStacksWithProductCount: builder.query<
      ApiResponse<Array<TechStack & { productCount: number }>>,
      void
    >({
      query: () => ({
        url: API_ROUTES.TECH_STACKS.WITH_PRODUCT_COUNT,
        method: API_METHODS.GET,
        contentType: 'json',
      }),
      providesTags: ['TechStack'],
    }),

    createTechStack: builder.mutation<ApiResponse<TechStack>, FormData>({
      query: formData => ({
        url: API_ROUTES.TECH_STACKS.CREATE,
        method: API_METHODS.POST,
        body: formData,
        contentType: 'form-data',
      }),
      invalidatesTags: ['TechStack'],
    }),

    updateTechStack: builder.mutation<
      ApiResponse<TechStack>,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: API_ROUTES.TECH_STACKS.UPDATE(id),
        method: API_METHODS.PUT,
        body: formData,
        contentType: 'form-data',
      }),
      invalidatesTags: ['TechStack'],
    }),

    deleteTechStack: builder.mutation<ApiResponse<null>, number>({
      query: id => ({
        url: API_ROUTES.TECH_STACKS.DELETE(id),
        method: API_METHODS.DELETE,
        contentType: 'json',
      }),
      invalidatesTags: ['TechStack'],
    }),
  }),
});

export const {
  useGetTechStacksQuery,
  useGetTechStackByIdQuery,
  useGetTechStackBySlugQuery,
  useSearchTechStacksQuery,
  useGetTechStacksWithProductCountQuery,
  useCreateTechStackMutation,
  useUpdateTechStackMutation,
  useDeleteTechStackMutation,
} = techStackApi;
