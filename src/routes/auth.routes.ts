import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load auth components
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));

// Auth route configurations
export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: React.createElement(LoginPage),
  },
  {
    path: '/register',
    element: React.createElement(RegisterPage),
  },
];

export default authRoutes;
