// Export individual API services
export { authApi } from './auth.api';
export { categoryApi } from './category.api';
export { productApi } from './product.api';
export { userApi } from './user.api';
export { uploadApi } from './upload.api';

// Export API configuration utilities
export {
  createBaseQuery,
  createFormData,
  type ContentType,
  type ApiErrorResponse,
} from './api.config';

// Response helpers now live in utils
export {
  isSuccessfulResponse,
  extractData,
  extractErrorMessage,
} from '@/utils/response.utils';

// Export individual hooks for convenience
export {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
} from './auth.api';

export {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from './category.api';

export {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetPopularProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './product.api';

export {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from './user.api';

export {
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
  useUploadAvatarMutation,
  useUploadProductImageMutation,
} from './upload.api';
