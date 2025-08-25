import { createApi } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '@/types';
import { API_ROUTES, API_METHODS } from '@/constants';
import { createBaseQuery, createFormData } from './api.config';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface UploadData {
  file: File;
  folder?: string;
  description?: string;
}

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: createBaseQuery(),
  tagTypes: ['Upload'],
  endpoints: (builder) => ({
    uploadSingleImage: builder.mutation<ApiResponse<UploadResponse>, UploadData>({
      query: (data) => {
        const formData = createFormData({
          file: data.file,
          folder: data.folder || 'images',
          description: data.description,
        });

        return {
          url: API_ROUTES.UPLOAD.SINGLE_IMAGE,
          method: API_METHODS.POST,
          body: formData,
          contentType: 'form-data',
        };
      },
      invalidatesTags: ['Upload'],
    }),

    uploadMultipleImages: builder.mutation<ApiResponse<UploadResponse[]>, { files: File[]; folder?: string }>({
      query: (data) => {
        const formData = createFormData({
          files: data.files,
          folder: data.folder || 'images',
        });

        return {
          url: API_ROUTES.UPLOAD.MULTIPLE_IMAGES,
          method: API_METHODS.POST,
          body: formData,
          contentType: 'form-data',
        };
      },
      invalidatesTags: ['Upload'],
    }),

    uploadAvatar: builder.mutation<ApiResponse<UploadResponse>, { file: File; userId?: number }>({
      query: (data) => {
        const formData = createFormData({
          file: data.file,
          userId: data.userId,
        });

        return {
          url: API_ROUTES.UPLOAD.AVATAR,
          method: API_METHODS.POST,
          body: formData,
          contentType: 'form-data',
        };
      },
      invalidatesTags: ['Upload'],
    }),

    uploadProductImage: builder.mutation<ApiResponse<UploadResponse>, { file: File; productId?: number }>({
      query: (data) => {
        const formData = createFormData({
          file: data.file,
          productId: data.productId,
        });

        return {
          url: API_ROUTES.UPLOAD.PRODUCT_IMAGE,
          method: API_METHODS.POST,
          body: formData,
          contentType: 'form-data',
        };
      },
      invalidatesTags: ['Upload'],
    }),
  }),
});

export const {
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
  useUploadAvatarMutation,
  useUploadProductImageMutation,
} = uploadApi;
