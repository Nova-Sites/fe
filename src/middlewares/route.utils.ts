import React from 'react';
import { Navigate } from 'react-router-dom';
import { USER_ROLES, ROUTE_GUARDS, FRONTEND_ROUTES } from '@/constants';
import { RouteConfig, RouteAccessContext, RouteAccessResult } from '@/types';

// Route configuration mapping
const routeConfigs: Record<string, RouteConfig> = {
  // Public routes
  [FRONTEND_ROUTES.PUBLIC.HOME]: {
    path: FRONTEND_ROUTES.PUBLIC.HOME,
    type: ROUTE_GUARDS.PUBLIC,
    requireAuth: false
  },
  [FRONTEND_ROUTES.PUBLIC.LOGIN]: {
    path: FRONTEND_ROUTES.PUBLIC.LOGIN,
    type: ROUTE_GUARDS.AUTH,
    requireAuth: false
  },
  [FRONTEND_ROUTES.PUBLIC.REGISTER]: {
    path: FRONTEND_ROUTES.PUBLIC.REGISTER,
    type: ROUTE_GUARDS.AUTH,
    requireAuth: false
  },
  [FRONTEND_ROUTES.PUBLIC.PRODUCTS]: {
    path: FRONTEND_ROUTES.PUBLIC.PRODUCTS,
    type: ROUTE_GUARDS.PUBLIC,
    requireAuth: false
  },
  [FRONTEND_ROUTES.PUBLIC.PRODUCT_DETAIL]: {
    path: FRONTEND_ROUTES.PUBLIC.PRODUCT_DETAIL,
    type: ROUTE_GUARDS.PUBLIC,
    requireAuth: false
  },
  [FRONTEND_ROUTES.PUBLIC.CATEGORIES]: {
    path: FRONTEND_ROUTES.PUBLIC.CATEGORIES,
    type: ROUTE_GUARDS.PUBLIC,
    requireAuth: false
  },

  // User routes
  [FRONTEND_ROUTES.PROTECTED.PROFILE]: {
    path: FRONTEND_ROUTES.PROTECTED.PROFILE,
    type: ROUTE_GUARDS.PROTECTED,
    requireAuth: true,
    redirectTo: FRONTEND_ROUTES.PUBLIC.LOGIN
  },

  // Admin routes
  [FRONTEND_ROUTES.ADMIN.DASHBOARD]: {
    path: FRONTEND_ROUTES.ADMIN.DASHBOARD,
    type: ROUTE_GUARDS.ADMIN,
    requireAuth: true,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    redirectTo: FRONTEND_ROUTES.PUBLIC.LOGIN
  },
  [FRONTEND_ROUTES.ADMIN.USERS]: {
    path: FRONTEND_ROUTES.ADMIN.USERS,
    type: ROUTE_GUARDS.ADMIN,
    requireAuth: true,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    redirectTo: FRONTEND_ROUTES.PUBLIC.LOGIN
  },
  [FRONTEND_ROUTES.ADMIN.PRODUCTS]: {
    path: FRONTEND_ROUTES.ADMIN.PRODUCTS,
    type: ROUTE_GUARDS.ADMIN,
    requireAuth: true,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    redirectTo: FRONTEND_ROUTES.PUBLIC.LOGIN
  },
  [FRONTEND_ROUTES.ADMIN.CATEGORIES]: {
    path: FRONTEND_ROUTES.ADMIN.CATEGORIES,
    type: ROUTE_GUARDS.ADMIN,
    requireAuth: true,
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    redirectTo: FRONTEND_ROUTES.PUBLIC.LOGIN
  }
};

// Get route configuration for a path
export const getRouteConfig = (path: string): RouteConfig => {
  // Try exact match first
  if (routeConfigs[path]) {
    return routeConfigs[path];
  }

  // Try pattern matching for dynamic routes
  for (const [pattern, config] of Object.entries(routeConfigs)) {
    if (isPathMatch(pattern, path)) {
      return config;
    }
  }

  // Default to public route if no match found
  return {
    path,
    type: 'public',
    requireAuth: false
  };
};

// Check if a path matches a pattern (supports dynamic segments)
export const isPathMatch = (pattern: string, path: string): boolean => {
  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/:[^/]+/g, '[^/]+') // Replace :param with regex
    .replace(/\*/g, '.*'); // Replace * with regex
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
};

// Check route access
export const checkRouteAccess = (
  routeConfig: RouteConfig,
  context: RouteAccessContext
): RouteAccessResult => {
  const { isAuthenticated, user, currentPath } = context;

  // Check if authentication is required
  if (routeConfig.requireAuth && !isAuthenticated) {
    return {
      hasAccess: false,
      redirectComponent: React.createElement(Navigate, {
        to: routeConfig.redirectTo || '/login',
        state: { from: currentPath },
        replace: true
      }),
      reason: 'Authentication required'
    };
  }

  // Check role requirements
  if (routeConfig.requiredRoles && user) {
    const hasRequiredRole = routeConfig.requiredRoles.some(role => {
      if (role === USER_ROLES.ADMIN) {
        return user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN;
      }
      if (role === USER_ROLES.SUPER_ADMIN) {
        return user.role === USER_ROLES.SUPER_ADMIN;
      }
      return user.role === role;
    });

    if (!hasRequiredRole) {
      return {
        hasAccess: false,
        redirectComponent: React.createElement(Navigate, {
          to: '/',
          replace: true
        }),
        reason: 'Insufficient permissions'
      };
    }
  }

  // Access granted
  return {
    hasAccess: true
  };
};

// Register new route configuration
export const registerRoute = (config: RouteConfig): void => {
  routeConfigs[config.path] = config;
};

// Register multiple routes
export const registerRoutes = (configs: RouteConfig[]): void => {
  configs.forEach(registerRoute);
};

// Get all route configurations
export const getAllRouteConfigs = (): RouteConfig[] => {
  return Object.values(routeConfigs);
};

// Check if user can access a specific route
export const canUserAccessRoute = (
  path: string,
  user: any,
  isAuthenticated: boolean
): boolean => {
  const routeConfig = getRouteConfig(path);
  const context: RouteAccessContext = {
    isAuthenticated,
    user,
    currentPath: path
  };

  const result = checkRouteAccess(routeConfig, context);
  return result.hasAccess;
};

// Get accessible routes for a user
export const getAccessibleRoutes = (
  user: any,
  isAuthenticated: boolean
): RouteConfig[] => {
  return getAllRouteConfigs().filter(config => 
    canUserAccessRoute(config.path, user, isAuthenticated)
  );
};

// Create route guard with custom configuration
export const createRouteGuard = (
  customConfigs: RouteConfig[] = []
) => {
  // Register custom configurations
  if (customConfigs.length > 0) {
    registerRoutes(customConfigs);
  }

  return {
    getRouteConfig,
    checkRouteAccess,
    canUserAccessRoute,
    getAccessibleRoutes,
    registerRoute,
    registerRoutes
  };
};
