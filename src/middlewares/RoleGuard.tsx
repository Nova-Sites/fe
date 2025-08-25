import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loading } from '@/components/common';
import { RoleGuardProps } from '@/types';

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  redirectTo = '/',
  fallback
}) => {
  const { user, isLoading } = useAuthContext();
  
  // Check if still loading
  if (isLoading) {
    return fallback ? <>{fallback}</> : <Loading />;
  }
  
  // Check if user has required role
  const hasRequiredRole = user && requiredRoles.includes(user.role);
  
  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export default RoleGuard;
