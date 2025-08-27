import { USER_ROLES, ROUTE_GUARDS } from "@/constants";
import { ReactNode } from "react";

// Derive literal union from USER_ROLES constant
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Derive literal union from ROUTE_GUARDS constant
export type RouteGuardType = typeof ROUTE_GUARDS[keyof typeof ROUTE_GUARDS];

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  image?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  image?: string;
  role: UserRole;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  views: number;
  slug: string;
  categoryId: number;
  isActive: boolean;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    products: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Filter Types
export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// UI Types
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface LoadingGuardProps {
  children: ReactNode;
  isLoading: boolean;
  fallback?: ReactNode;
  minLoadingTime?: number;
  showLoadingOnMount?: boolean;
}

export interface RoleGuardProps {
  children: ReactNode;
  requiredRoles: string[];
  redirectTo?: string;
  fallback?: ReactNode;
}

// Route configuration interface
export interface RouteConfig {
  path: string;
  type: RouteGuardType;
  requireAuth: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
}

// Route access context
export interface RouteAccessContext {
  isAuthenticated: boolean;
  user: any;
  currentPath: string;
}

// Route access result
export interface RouteAccessResult {
  hasAccess: boolean;
  redirectComponent?: React.ReactElement;
  reason?: string;
}

