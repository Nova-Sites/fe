import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { AppRoute, GuardConfig } from '@/types/route';
import RouteGuard from '@/middlewares/RouteGuard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/** 🧭 Helper: Wrap element with Suspense fallback */
const withSuspense = (element?: React.ReactNode) =>
  element ? (
    <Suspense fallback={<LoadingSpinner message='Loading page...' />}>
      {element}
    </Suspense>
  ) : undefined;

/** 🛡️ Helper: Wrap element with guard */
const withGuard = (element?: React.ReactNode, config?: GuardConfig) =>
  element ? <RouteGuard config={config}>{element}</RouteGuard> : undefined;

/** 🏗 Helper: Wrap element with Layout */
const withLayout = (
  element?: React.ReactNode,
  Layout?: React.ComponentType<{ children: React.ReactNode }>
) =>
  element && Layout ? (
    <Layout>
      <Suspense fallback={<LoadingSpinner message='Loading page...' />}>
        {element}
      </Suspense>
    </Layout>
  ) : (
    withSuspense(element)
  );

/** 🔐 Create a single protected route */
export const createProtectedRoute = (
  route: AppRoute,
  guardConfig?: GuardConfig
): RouteObject => {
  const element = withGuard(withSuspense(route.element), guardConfig);

  if (route.index) return { index: true, element };

  return {
    path: route.path,
    element,
    children: route.children?.map(child =>
      createProtectedRoute(child, guardConfig)
    ),
  };
};

/** 🔐 Create multiple protected routes */
export const createProtectedRoutes = (
  routes: AppRoute[],
  guardConfig?: GuardConfig
): RouteObject[] =>
  routes.map(route => createProtectedRoute(route, guardConfig));

/** 🌐 Create public routes (no guard) */
export const createPublicRoutes = (routes: AppRoute[]): RouteObject[] =>
  routes.map(route => {
    const element = withSuspense(route.element);
    if (route.index) return { index: true, element };

    return {
      path: route.path,
      element,
      children: route.children ? createPublicRoutes(route.children) : undefined,
    };
  });

/** 🧩 Create route with layout wrapper */
export const createLayoutRoute = (
  route: AppRoute,
  Layout: React.ComponentType<{ children: React.ReactNode }>
): RouteObject => {
  const element = withLayout(route.element, Layout);

  if (route.index) return { index: true, element };

  return {
    path: route.path,
    element,
    children: route.children?.map(child => createLayoutRoute(child, Layout)),
  };
};

/**
 * Merge route metadata with guard configuration
 */
export const mergeRouteConfig = (
  route: AppRoute,
  defaultConfig?: GuardConfig
): GuardConfig => {
  return {
    requiresAuth:
      route.meta?.requiresAuth ?? defaultConfig?.requiresAuth ?? false,
    allowedRoles: route.meta?.allowedRoles ?? defaultConfig?.allowedRoles,
    redirectTo: defaultConfig?.redirectTo,
  };
};

/**
 * Validate route configuration
 */
export const validateRoute = (route: RouteObject): boolean => {
  if (!route.path && !route.index) {
    console.warn('Route must have either path or index property');
    return false;
  }

  return true;
};

/**
 * Filter routes by role
 */
export const filterRoutesByRole = (
  routes: AppRoute[],
  userRole?: string
): AppRoute[] => {
  return routes.filter(route => {
    if (!route.meta?.allowedRoles) return true;
    if (!userRole) return false;
    return route.meta.allowedRoles.includes(userRole);
  });
};

/**
 * Create route breadcrumbs
 */
export const createBreadcrumbs = (
  pathname: string,
  routes: AppRoute[]
): Array<{ label: string; path: string }> => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; path: string }> = [];

  let currentPath = '';

  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;

    const route = routes.find(r => r.path === currentPath);
    const label =
      route?.meta?.title || segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      path: currentPath,
    });
  });

  return breadcrumbs;
};
