import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loading } from '@/components/common';
import { 
  checkRouteAccess, 
  getRouteConfig
} from './route.utils';

interface RouteGuardProps {
  children: ReactNode;
  routePath?: string;
  fallback?: ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  routePath,
  fallback
}) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuthContext();
  
  // Use provided routePath or current location
  const currentPath = routePath || location.pathname;
  
  // Get route configuration
  const routeConfig = getRouteConfig(currentPath);
  
  // Check if still loading
  if (isLoading) {
    return <Loading />;
  }
  
  // Check route access
  const accessResult = checkRouteAccess(routeConfig, {
    isAuthenticated,
    user,
    currentPath
  });
  
  // If access denied, show fallback or redirect
  if (!accessResult.hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Use default redirect logic
    return accessResult.redirectComponent || <>{children}</>;
  }
  
  // Access granted, render children
  return <>{children}</>;
};

export default RouteGuard;
