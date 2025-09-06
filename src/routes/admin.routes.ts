import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { FRONTEND_ROUTES } from '@/constants';
import { AdminLayout } from '@/components/layouts';

const AdminDashboard = lazy(() => import('@/pages/Admin/AdminDashboard'));
const AdminProductsPage = lazy(() => import('@/pages/Admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(
  () => import('@/pages/Admin/AdminCategoriesPage')
);
const AdminOrdersPage = lazy(() => import('@/pages/Admin/AdminOrdersPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: FRONTEND_ROUTES.ADMIN.DASHBOARD,
    element: React.createElement(AdminLayout),
    children: [
      { index: true, element: React.createElement(AdminDashboard) },
      { path: 'products', element: React.createElement(AdminProductsPage) },
      { path: 'categories', element: React.createElement(AdminCategoriesPage) },
      { path: 'orders', element: React.createElement(AdminOrdersPage) },
    ],
  },
];

export default adminRoutes;
