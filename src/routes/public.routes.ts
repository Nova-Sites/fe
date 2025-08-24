import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load public components
const HomePage = lazy(() => import('@/pages/HomePage'));

// Public route configurations
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: React.createElement(HomePage),
  },
];

export default publicRoutes;
