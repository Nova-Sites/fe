import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { FRONTEND_ROUTES } from '@/constants';

// Lazy load user components
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'));
const ProductsPage = lazy(() => import('@/pages/Products/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/Products/ProductDetailPage'));
const CategoriesPage = lazy(() => import('@/pages/Categories/CategoriesPage'));

// User route configurations
export const userRoutes: RouteObject[] = [
  {
    path: FRONTEND_ROUTES.PROTECTED.PROFILE,
    element: React.createElement(ProfilePage),
  },
  {
    path: FRONTEND_ROUTES.PUBLIC.PRODUCTS,
    element: React.createElement(ProductsPage),
  },
  {
    path: FRONTEND_ROUTES.PUBLIC.PRODUCT_DETAIL,
    element: React.createElement(ProductDetailPage),
  },
  {
    path: FRONTEND_ROUTES.PUBLIC.CATEGORIES,
    element: React.createElement(CategoriesPage),
  },
];

export default userRoutes;
