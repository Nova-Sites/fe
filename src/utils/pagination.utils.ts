// Pagination interface
export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

// Calculate pagination info
export const calculatePagination = (
  options: PaginationOptions
): PaginationResult => {
  const { page, limit, total } = options;

  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  const nextPage = hasNext ? page + 1 : null;
  const prevPage = hasPrev ? page - 1 : null;

  return {
    page,
    limit,
    total,
    totalPages,
    offset,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
  };
};

// Validate pagination parameters
export const validatePagination = (
  page: number,
  limit: number,
  maxLimit: number = 100
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (page < 1) {
    errors.push('Page must be greater than 0');
  }

  if (limit < 1) {
    errors.push('Limit must be greater than 0');
  }

  if (limit > maxLimit) {
    errors.push(`Limit cannot exceed ${maxLimit}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Get pagination links for API
export const getPaginationLinks = (
  baseUrl: string,
  pagination: PaginationResult,
  queryParams: Record<string, unknown> = {}
): Record<string, string | null> => {
  const { page, totalPages, hasNext, hasPrev, nextPage, prevPage } = pagination;

  const buildUrl = (pageNum: number) => {
    const params = new URLSearchParams({
      ...queryParams,
      page: pageNum.toString(),
      limit: pagination.limit.toString(),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return {
    first: buildUrl(1),
    last: buildUrl(totalPages),
    prev: hasPrev ? buildUrl(prevPage!) : null,
    next: hasNext ? buildUrl(nextPage!) : null,
    current: buildUrl(page),
  };
};

// Get pagination metadata
export const getPaginationMetadata = (pagination: PaginationResult) => {
  const { page, limit, total, totalPages, offset } = pagination;

  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems: total,
    totalPages,
    startItem: offset + 1,
    endItem: Math.min(offset + limit, total),
  };
};

// Parse pagination from query string
export const parsePaginationFromQuery = (
  query: Record<string, unknown>,
  defaultPage: number = 1,
  defaultLimit: number = 10
): { page: number; limit: number } => {
  const page = parseInt(query.page as string) || defaultPage;
  const limit = parseInt(query.limit as string) || defaultLimit;

  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(100, limit)),
  };
};

// Apply pagination to array
export const paginateArray = <T>(
  array: T[],
  page: number,
  limit: number
): { data: T[]; pagination: PaginationResult } => {
  const total = array.length;
  const pagination = calculatePagination({ page, limit, total });
  const startIndex = pagination.offset;
  const endIndex = startIndex + limit;

  const data = array.slice(startIndex, endIndex);

  return { data, pagination };
};

// Get page numbers for pagination display
export const getPageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
};
