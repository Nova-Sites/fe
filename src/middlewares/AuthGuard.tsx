import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loading } from '@/components/common';
import { FRONTEND_ROUTES } from '@/constants';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = FRONTEND_ROUTES.PUBLIC.LOGIN,
  fallback
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  // Check if still loading
  if (isLoading) {
    return fallback ? <>{fallback}</> : <Loading />;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;
