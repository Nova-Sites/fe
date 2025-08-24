import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load user components
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'));
const ProductsPage = lazy(() => import('@/pages/Products/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/Products/ProductDetailPage'));
const CategoriesPage = lazy(() => import('@/pages/Categories/CategoriesPage'));

// User route configurations
export const userRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: React.createElement(ProfilePage),
  },
  {
    path: '/products',
    element: React.createElement(ProductsPage),
  },
  {
    path: '/products/:slug',
    element: React.createElement(ProductDetailPage),
  },
  {
    path: '/categories',
    element: React.createElement(CategoriesPage),
  },
];

export default userRoutes;
