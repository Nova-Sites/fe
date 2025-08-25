import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loading } from '@/components/common';
import { ErrorBoundary, RouteGuard } from '@/middlewares';
import { AuthProvider } from '@/contexts/AuthContext';
import {
  publicRoutes,
  authRoutes,
  userRoutes,
  adminRoutes,
} from '@/routes';
import { RouteObject } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Routes */}
              {publicRoutes.map((route: RouteObject) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}

              {/* Auth Routes */}
              {authRoutes.map((route: RouteObject) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}

              {/* Protected User Routes */}
              {userRoutes.map((route: RouteObject) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <RouteGuard>
                      {route.element}
                    </RouteGuard>
                  }
                />
              ))}

              {/* Protected Admin Routes */}
              {adminRoutes.map((route: RouteObject) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <RouteGuard>
                      {route.element}
                    </RouteGuard>
                  }
                />
              ))}

              {/* Catch all route -> 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
