import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FRONTEND_ROUTES } from '@/constants';

interface Props {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const RoleGuard: React.FC<Props> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated)
    return <Navigate to={FRONTEND_ROUTES.PUBLIC.LOGIN} replace />;

  const role = user?.role;
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={FRONTEND_ROUTES.PUBLIC.NOT_FOUND} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
