// API Route Constants
export const API_ROUTES = {
  // Auth Routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User Routes
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile', // Đúng với backend
    UPDATE_PROFILE: '/users/profile',
    UPDATE_AVATAR: '/users/profile/avatar',
    CHANGE_PASSWORD: '/users/change-password',
    GET_ALL: '/users',
    GET_BY_ID: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    SOFT_DELETE: (id: number) => `/users/${id}/soft-delete`,
  },

  // Category Routes
  CATEGORIES: {
    BASE: '/categories',
    GET_ALL: '/categories',
    GET_BY_ID: (id: number) => `/categories/${id}`,
    GET_BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
    SEARCH: '/categories/search',
    WITH_PRODUCT_COUNT: '/categories/with-product-count',
    CREATE: '/categories',
    UPDATE: (id: number) => `/categories/${id}`,
    DELETE: (id: number) => `/categories/${id}`,
    SOFT_DELETE: (id: number) => `/categories/${id}/soft-delete`,
  },

  // Product Routes
  PRODUCTS: {
    BASE: '/products',
    GET_ALL: '/products',
    GET_BY_ID: (id: number) => `/products/${id}`,
    GET_BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    POPULAR: '/products/popular',
    SEARCH: '/products/search',
    BY_CATEGORY: (categoryId: number) => `/products/category/${categoryId}`,
    BY_TECH_STACK: (techStackId: number) =>
      `/products/tech-stack/${techStackId}`,
    BY_PRICE_RANGE: (minPrice: number, maxPrice: number) =>
      `/products/price-range/${minPrice}/${maxPrice}`,
    CREATE: '/products',
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    SOFT_DELETE: (id: number) => `/products/${id}/soft-delete`,
  },

  // Tech Stack Routes
  TECH_STACKS: {
    BASE: '/tech-stacks',
    GET_ALL: '/tech-stacks',
    GET_BY_ID: (id: number) => `/tech-stacks/${id}`,
    GET_BY_SLUG: (slug: string) => `/tech-stacks/slug/${slug}`,
    SEARCH: '/tech-stacks/search',
    WITH_PRODUCT_COUNT: '/tech-stacks/with-product-count',
    CREATE: '/tech-stacks',
    UPDATE: (id: number) => `/tech-stacks/${id}`,
    DELETE: (id: number) => `/tech-stacks/${id}`,
  },

  // Upload Routes
  UPLOAD: {
    BASE: '/upload',
    SINGLE_IMAGE: '/upload/single-image',
    MULTIPLE_IMAGES: '/upload/multiple-images',
    AVATAR: '/upload/avatar',
    PRODUCT_IMAGE: '/upload/product-image',
    PRODUCT_IMAGES: '/upload/product-images',
  },

  // Health Check
  HEALTH: '/health',
} as const;

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

// Frontend Route Paths
export const FRONTEND_ROUTES = {
  // Public Routes
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:slug',
    CATEGORIES: '/categories',
    CATEGORY_DETAIL: '/categories/:slug',
    ABOUT: '/about',
    CONTACT: '/contact',
    FORBIDDEN: '/403',
    NOT_FOUND: '/404',
  },

  // Protected Routes
  PROTECTED: {
    PROFILE: '/profile',
    DASHBOARD: '/dashboard',
    ORDERS: '/orders',
    WISHLIST: '/wishlist',
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    ORDERS: '/admin/orders',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
} as const;

// Route Guards
export const ROUTE_GUARDS = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  AUTH: 'auth',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;
