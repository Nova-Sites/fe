import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { FRONTEND_ROUTES } from '@/constants';

// Lazy load auth components
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));

// Auth route configurations
export const authRoutes: RouteObject[] = [
  {
    path: FRONTEND_ROUTES.PUBLIC.LOGIN,
    element: React.createElement(LoginPage),
  },
  {
    path: FRONTEND_ROUTES.PUBLIC.REGISTER,
    element: React.createElement(RegisterPage),
  },
];

export default authRoutes;
