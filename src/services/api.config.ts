import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ROUTES, API_METHODS } from '@/constants';

// Custom error response type
export interface ApiErrorResponse {
  status: number;
  error?: string;
  message?: string;
  data: {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
  };
}

// Content type options
export type ContentType = 'json' | 'form-data';

// Base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  credentials: 'include', // Important for cookies (backend sẽ tự động gửi)
  // prepareHeaders: (headers) => {
  //   // Backend set cookies với httpOnly: true, frontend không thể đọc được
  //   // Chỉ có thể sử dụng token từ localStorage/sessionStorage
  //   const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  //   if (accessToken) {
  //     headers.set('Authorization', `Bearer ${accessToken}`);
  //   }
  //   return headers;
  // },
});

let isRefreshing = false;

// Enhanced base query with error handling, content-type support, and refresh token logic
export const createBaseQuery = (): BaseQueryFn<
  FetchArgs & { contentType?: ContentType },
  unknown,
  FetchBaseQueryError
> => {
  return async (args, api, extraOptions) => {
    const { contentType = 'json', ...fetchArgs } = args;

    // Set content type header
    if (contentType === 'form-data') {
      // For form-data, don't set Content-Type header (browser will set it automatically)
      // Remove any existing Content-Type header
      if (fetchArgs.headers) {
        try {
          const headers = new Headers(fetchArgs.headers as HeadersInit);
          headers.delete('Content-Type');
          fetchArgs.headers = headers;
        } catch {
          // If Headers constructor fails, create new headers object
          const newHeaders: Record<string, string> = {};
          if (
            typeof fetchArgs.headers === 'object' &&
            fetchArgs.headers !== null
          ) {
            Object.entries(fetchArgs.headers).forEach(([key, value]) => {
              if (key !== 'Content-Type' && value !== undefined) {
                newHeaders[key] = String(value);
              }
            });
          }
          fetchArgs.headers = newHeaders;
        }
      }
    } else {
      // For JSON, ensure Content-Type is set
      if (fetchArgs.headers) {
        try {
          const headers = new Headers(fetchArgs.headers as HeadersInit);
          headers.set('Content-Type', 'application/json');
          fetchArgs.headers = headers;
        } catch {
          // If Headers constructor fails, create new headers object
          const newHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (
            typeof fetchArgs.headers === 'object' &&
            fetchArgs.headers !== null
          ) {
            Object.entries(fetchArgs.headers).forEach(([key, value]) => {
              if (value !== undefined) {
                newHeaders[key] = String(value);
              }
            });
          }
          fetchArgs.headers = newHeaders;
        }
      } else {
        fetchArgs.headers = { 'Content-Type': 'application/json' };
      }
    }

    // Execute the base query
    const result = await baseQuery(fetchArgs, api, extraOptions);

    // Handle 401 errors (unauthorized) with refresh token logic
    if (result.error && result.error.status === 401) {
      const url = String(fetchArgs.url);

      // Don't try refresh for auth-related endpoints to prevent infinite loops
      if (
        !url.includes(API_ROUTES.AUTH.LOGIN) &&
        !url.includes(API_ROUTES.AUTH.REGISTER) &&
        !url.includes(API_ROUTES.AUTH.REFRESH_TOKEN)
      ) {
        // Try to refresh token
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            // Call refresh token endpoint - cookies sẽ được gửi tự động
            const refreshResult = await baseQuery(
              {
                url: API_ROUTES.AUTH.REFRESH_TOKEN,
                method: API_METHODS.POST,
                credentials: 'include',
              },
              api,
              extraOptions
            );

            if (refreshResult.data) {
              // Cập nhật token trong storage nếu refresh thành công
              const newTokens = (refreshResult.data as Record<string, unknown>)
                ?.data as { tokens?: { accessToken?: string } };
              if (newTokens?.tokens?.accessToken) {
                // localStorage.setItem('access_token', newTokens.accessToken);
                console.log('🔄 Updated access token in storage after refresh');
              }

              // // Retry the original request with new token
              // result = await baseQuery(fetchArgs, api, extraOptions);

              // // If still 401 after refresh, then logout
              // if (result.error && result.error.status === 401) {
              //   await handleLogout();
              // }
            } else {
              await handleLogout();
            }
          } catch (refreshError) {
            console.error('Error during token refresh:', refreshError);
            await handleLogout();
          }
        }
      }
    }

    // Handle other errors
    if (result.error) {
      const error = result.error as ApiErrorResponse;

      // Enhance error message for user
      if (error.data?.errors && Object.keys(error.data.errors).length > 0) {
        // Format validation errors
        const validationMessages = Object.entries(error.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ');

        error.data.message = `Validation failed: ${validationMessages}`;
      }
    }

    return result;
  };
};

// Helper function to handle logout
const handleLogout = async () => {
  try {
    // Call logout endpoint to clear cookies
    await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Helper function to create form data from object
export const createFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(key, String(item));
          }
        });
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

// Helper function to check if response is successful
// Response helpers moved to utils/response.utils.ts
