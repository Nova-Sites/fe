// Route type definitions for enhanced routing system

export interface AppRoute {
  path?: string;
  element?: React.ReactNode;
  index?: boolean;
  children?: AppRoute[];
  role?: 'user' | 'admin';
  layout?: React.ComponentType;
  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
    allowedRoles?: string[];
  };
}

export interface GuardConfig {
  requiresAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export interface RouteGuardProps {
  children: React.ReactNode;
  config?: GuardConfig;
}
