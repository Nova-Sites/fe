import React from 'react';
import { Navigate } from 'react-router-dom';

// Route configuration interface
export interface RouteConfig {
  path: string;
  type: 'public' | 'auth' | 'user' | 'admin';
  requireAuth: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
}

// Route access context
export interface RouteAccessContext {
  isAuthenticated: boolean;
  user?: any;
  currentPath: string;
}

// Route access result
export interface RouteAccessResult {
  hasAccess: boolean;
  redirectComponent?: React.ReactElement;
  reason?: string;
}

// Route configuration mapping
const routeConfigs: Record<string, RouteConfig> = {
  // Public routes
  '/': {
    path: '/',
    type: 'public',
    requireAuth: false
  },
  '/login': {
    path: '/login',
    type: 'auth',
    requireAuth: false
  },
  '/register': {
    path: '/register',
    type: 'auth',
    requireAuth: false
  },
  '/products': {
    path: '/products',
    type: 'public',
    requireAuth: false
  },
  '/products/:slug': {
    path: '/products/:slug',
    type: 'public',
    requireAuth: false
  },
  '/categories': {
    path: '/categories',
    type: 'public',
    requireAuth: false
  },

  // User routes
  '/profile': {
    path: '/profile',
    type: 'user',
    requireAuth: true,
    redirectTo: '/login'
  },

  // Admin routes
  '/admin': {
    path: '/admin',
    type: 'admin',
    requireAuth: true,
    requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
    redirectTo: '/login'
  },
  '/admin/users': {
    path: '/admin/users',
    type: 'admin',
    requireAuth: true,
    requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
    redirectTo: '/login'
  },
  '/admin/products': {
    path: '/admin/products',
    type: 'admin',
    requireAuth: true,
    requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
    redirectTo: '/login'
  },
  '/admin/categories': {
    path: '/admin/categories',
    type: 'admin',
    requireAuth: true,
    requiredRoles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
    redirectTo: '/login'
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
      if (role === 'ROLE_ADMIN') {
        return user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SUPER_ADMIN';
      }
      if (role === 'ROLE_SUPER_ADMIN') {
        return user.role === 'ROLE_SUPER_ADMIN';
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
