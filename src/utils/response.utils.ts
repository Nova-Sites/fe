// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  path?: string;
}

// Success response helper
export const successResponse = <T>(
  data: T,
  message: string = 'Success',
  path?: string
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    path
  };
};

// Error response helper
export const errorResponse = (
  message: string = 'Error occurred',
  error?: string,
  path?: string
): ApiResponse => {
  return {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
    path
  };
};

// Pagination response interface
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Paginated response helper
export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success',
  path?: string
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    timestamp: new Date().toISOString(),
    path
  };
};

// Validation error response
export const validationErrorResponse = (
  errors: Array<{ field: string; message: string; value?: any }>,
  path?: string
): ApiResponse => {
  return {
    success: false,
    message: 'Validation failed',
    error: 'Validation errors occurred',
    data: { errors },
    timestamp: new Date().toISOString(),
    path
  };
};

// Not found response
export const notFoundResponse = (
  resource: string = 'Resource',
  path?: string
): ApiResponse => {
  return {
    success: false,
    message: `${resource} not found`,
    timestamp: new Date().toISOString(),
    path
  };
};

// Unauthorized response
export const unauthorizedResponse = (
  message: string = 'Unauthorized access',
  path?: string
): ApiResponse => {
  return {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path
  };
};

// Forbidden response
export const forbiddenResponse = (
  message: string = 'Access forbidden',
  path?: string
): ApiResponse => {
  return {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path
  };
};

// Conflict response
export const conflictResponse = (
  message: string = 'Resource conflict',
  path?: string
): ApiResponse => {
  return {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path
  };
};

// Rate limit response
export const rateLimitResponse = (
  retryAfter: number,
  path?: string
): ApiResponse => {
  return {
    success: false,
    message: 'Too many requests',
    error: 'Rate limit exceeded',
    data: { retryAfter },
    timestamp: new Date().toISOString(),
    path
  };
};

// Client-side helpers (moved from services/api.config.ts)
export const isSuccessfulResponse = (response: unknown): boolean => {
  return (response as { data?: { success?: boolean } })?.data?.success === true;
};

export const extractData = <T>(response: unknown): T | null => {
  if (isSuccessfulResponse(response)) {
    return (response as { data: { data: T } }).data.data;
  }
  return null;
};

export const extractErrorMessage = (response: unknown): string => {
  const errorResponse = response as { error?: { data?: { message?: string }; message?: string } };
  if (errorResponse?.error?.data?.message) {
    return errorResponse.error.data.message;
  }
  if (errorResponse?.error?.message) {
    return errorResponse.error.message;
  }
  return 'An unexpected error occurred';
};