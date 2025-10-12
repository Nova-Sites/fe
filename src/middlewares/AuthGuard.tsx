import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FRONTEND_ROUTES } from '@/constants';

interface Props {
  children: React.ReactNode;
}

const AuthGuard: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated)
    return <Navigate to={FRONTEND_ROUTES.PUBLIC.LOGIN} replace />;

  return <>{children}</>;
};

export default AuthGuard;
