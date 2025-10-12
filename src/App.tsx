import React, { Suspense, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  RouteObject,
} from 'react-router-dom';
import { ErrorBoundary } from '@/middlewares';
import { AuthProvider } from '@/contexts/AuthContext';
import { publicRoutes, authRoutes, userRoutes, adminRoutes } from '@/routes';
import { FRONTEND_ROUTES, USER_ROLES } from '@/constants';

import { AppRoute, GuardConfig } from '@/types/route';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  createPublicRoutes,
  createProtectedRoutes,
  validateRoute,
} from '@/utils/routeUtils';

/**
 * 🎯 Route Renderer with Enhanced Logic
 * Handles route rendering with proper validation and optimization
 */
const renderRoutes = (routes: RouteObject[], key: string) => {
  return routes.filter(validateRoute).map((route, index) => {
    const routeKey = route.path ? `${key}-${route.path}` : `${key}-${index}`;

    return (
      <Route key={routeKey} path={route.path} element={route.element}>
        {route.children?.map((child: RouteObject, childIndex: number) => {
          const childKey = child.path
            ? `${routeKey}-${child.path}`
            : `${routeKey}-child-${childIndex}`;
          return (
            <Route
              key={childKey}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          );
        })}
      </Route>
    );
  });
};

/**
 * 🚀 Enhanced App Component with Optimized Routing
 * Features:
 * - Type-safe route handling
 * - Optimized guard composition
 * - Better error handling
 * - Performance optimization with memoization
 */
const App: React.FC = () => {
  // 🎯 Memoized route configurations for better performance
  const routeConfigs = useMemo(() => {
    // Public routes (no authentication required)
    const publicRouteObjects = createPublicRoutes(publicRoutes as AppRoute[]);

    // Auth routes (no authentication required)
    const authRouteObjects = createPublicRoutes(authRoutes as AppRoute[]);

    // User routes (authentication required)
    const userGuardConfig: GuardConfig = {
      requiresAuth: true,
      redirectTo: FRONTEND_ROUTES.PUBLIC.LOGIN,
    };
    const userRouteObjects = createProtectedRoutes(
      userRoutes as AppRoute[],
      userGuardConfig
    );

    // Admin routes (authentication + admin role required)
    const adminGuardConfig: GuardConfig = {
      requiresAuth: true,
      allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
      redirectTo: FRONTEND_ROUTES.PUBLIC.LOGIN,
    };
    const adminRouteObjects = createProtectedRoutes(
      adminRoutes as AppRoute[],
      adminGuardConfig
    );

    return {
      public: publicRouteObjects,
      auth: authRouteObjects,
      user: userRouteObjects,
      admin: adminRouteObjects,
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner message='Initializing app...' />}>
            <Routes>
              {/* 🌐 Public routes - No authentication required */}
              {renderRoutes(routeConfigs.public, 'public')}

              {/* 🔐 Auth routes - Login/Register/OTP */}
              {renderRoutes(routeConfigs.auth, 'auth')}

              {/* 👤 Protected user routes - Authentication required */}
              {renderRoutes(routeConfigs.user, 'user')}

              {/* 🛡️ Protected admin routes - Authentication + Admin role required */}
              {renderRoutes(routeConfigs.admin, 'admin')}

              {/* 🚫 404 fallback - Must be last */}
              <Route
                path='*'
                element={
                  <Navigate to={FRONTEND_ROUTES.PUBLIC.NOT_FOUND} replace />
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
