import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load admin components
const AdminDashboard = lazy(() => import('@/pages/Admin/AdminDashboard'));

// Admin route configurations
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: React.createElement(AdminDashboard),
  },
  // Add more admin routes here as needed
  // {
  //   path: '/admin/users',
  //   element: React.createElement(AdminUsersPage),
  // },
  // {
  //   path: '/admin/products',
  //   element: React.createElement(AdminProductsPage),
  // },
  // {
  //   path: '/admin/categories',
  //   element: React.createElement(AdminCategoriesPage),
  // },
];

export default adminRoutes;
