import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { FRONTEND_ROUTES } from '@/constants';

// Lazy load public components
const HomePage = lazy(() => import('@/pages/HomePage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Public route configurations
export const publicRoutes: RouteObject[] = [
  {
    path: FRONTEND_ROUTES.PUBLIC.HOME,
    element: React.createElement(HomePage),
  },
  {
    path: FRONTEND_ROUTES.PUBLIC.FORBIDDEN,
    element: React.createElement(ForbiddenPage),
  },
  {
    path: FRONTEND_ROUTES.PUBLIC.NOT_FOUND,
    element: React.createElement(NotFoundPage),
  },
];

export default publicRoutes;
