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
    METHODS: {
      LOGIN: 'POST',
      REGISTER: 'POST',
      LOGOUT: 'POST',
      REFRESH_TOKEN: 'POST',
      VERIFY_OTP: 'POST',
      RESEND_OTP: 'POST',
      FORGOT_PASSWORD: 'POST',
      RESET_PASSWORD: 'POST',
    },
  },

  // User Routes
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile', // Đúng với backend
    UPDATE_PROFILE: '/users/profile',
    UPDATE_AVATAR: '/users/profile/avatar',
    CHANGE_PASSWORD: '/users/change-password',
    GET_ALL: '/users',
    GET_BY_ID: '/users/:id',
    DELETE: '/users/:id',
    SOFT_DELETE: '/users/:id/soft-delete',
    METHODS: {
      GET_ALL: 'GET',
      GET_BY_ID: 'GET',
      GET_PROFILE: 'GET', // Thêm method cho profile
      UPDATE_PROFILE: 'PUT',
      UPDATE_AVATAR: 'PUT',
      CHANGE_PASSWORD: 'PUT',
      DELETE: 'DELETE',
      SOFT_DELETE: 'DELETE',
    },
  },

  // Category Routes
  CATEGORIES: {
    BASE: '/categories',
    GET_ALL: '/categories',
    GET_BY_ID: '/categories/:id',
    GET_BY_SLUG: '/categories/slug/:slug',
    SEARCH: '/categories/search',
    WITH_PRODUCT_COUNT: '/categories/with-product-count',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
    SOFT_DELETE: '/categories/:id/soft-delete',
    METHODS: {
      GET_ALL: 'GET',
      GET_BY_ID: 'GET',
      GET_BY_SLUG: 'GET',
      SEARCH: 'GET',
      WITH_PRODUCT_COUNT: 'GET',
      CREATE: 'POST',
      UPDATE: 'PUT',
      DELETE: 'DELETE',
      SOFT_DELETE: 'DELETE',
    },
  },

  // Product Routes
  PRODUCTS: {
    BASE: '/products',
    GET_ALL: '/products',
    GET_BY_ID: '/products/:id',
    GET_BY_SLUG: '/products/slug/:slug',
    POPULAR: '/products/popular',
    SEARCH: '/products/search',
    BY_CATEGORY: '/products/category/:categoryId',
    BY_PRICE_RANGE: '/products/price-range/:minPrice/:maxPrice',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    SOFT_DELETE: '/products/:id/soft-delete',
    METHODS: {
      GET_ALL: 'GET',
      GET_BY_ID: 'GET',
      GET_BY_SLUG: 'GET',
      POPULAR: 'GET',
      SEARCH: 'GET',
      BY_CATEGORY: 'GET',
      BY_PRICE_RANGE: 'GET',
      CREATE: 'POST',
      UPDATE: 'PUT',
      DELETE: 'DELETE',
      SOFT_DELETE: 'DELETE',
    },
  },

  // Upload Routes
  UPLOAD: {
    BASE: '/upload',
    SINGLE_IMAGE: '/upload/single-image',
    MULTIPLE_IMAGES: '/upload/multiple-images',
    AVATAR: '/upload/avatar',
    PRODUCT_IMAGE: '/upload/product-image',
    PRODUCT_IMAGES: '/upload/product-images',
    METHODS: {
      SINGLE_IMAGE: 'POST',
      MULTIPLE_IMAGES: 'POST',
      AVATAR: 'POST',
      PRODUCT_IMAGE: 'POST',
      PRODUCT_IMAGES: 'POST',
    },
  },

  // Health Check
  HEALTH: '/health',
} as const;

// Frontend Route Paths
export const FRONTEND_ROUTES = {
  // Public Routes
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:slug',
    CATEGORIES: '/categories',
    CATEGORY_DETAIL: '/categories/:slug',
    ABOUT: '/about',
    CONTACT: '/contact',
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
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;
