import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FRONTEND_ROUTES } from '@/constants';
import { GuardConfig } from '@/types/route';

interface RouteGuardProps {
  children: React.ReactNode;
  config?: GuardConfig;
}

/**
 * 🛡️ Universal Route Guard Component
 * Handles authentication and authorization in one place
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children, config = {} }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  const guardResult = useMemo(() => {
    // Show loading while auth state is being determined
    if (isLoading) {
      return { shouldRender: false, redirectTo: null };
    }

    // Check authentication requirement
    if (config.requiresAuth && !isAuthenticated) {
      return {
        shouldRender: false,
        redirectTo: config.redirectTo || FRONTEND_ROUTES.PUBLIC.LOGIN,
      };
    }

    // Check role-based authorization
    if (config.allowedRoles && config.allowedRoles.length > 0) {
      if (!isAuthenticated) {
        return {
          shouldRender: false,
          redirectTo: FRONTEND_ROUTES.PUBLIC.LOGIN,
        };
      }

      if (!user?.role || !config.allowedRoles.includes(user.role)) {
        return {
          shouldRender: false,
          redirectTo: FRONTEND_ROUTES.PUBLIC.FORBIDDEN,
        };
      }
    }

    return { shouldRender: true, redirectTo: null };
  }, [isAuthenticated, user?.role, isLoading, config]);

  // Redirect if needed
  if (guardResult.redirectTo) {
    return <Navigate to={guardResult.redirectTo} replace />;
  }

  // Render children if all guards pass
  return <>{children}</>;
};

export default RouteGuard;
