import React, { useState, useEffect } from 'react';
import { Loading } from '@/components/common';
import { LoadingGuardProps } from '@/types';

export const LoadingGuard: React.FC<LoadingGuardProps> = ({
  children,
  isLoading,
  fallback,
  minLoadingTime = 300,
  showLoadingOnMount = true
}) => {
  const [showLoading, setShowLoading] = useState(showLoadingOnMount);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      setLoadingStartTime(Date.now());
      setShowLoading(true);
    } else {
      if (loadingStartTime) {
        const elapsed = Date.now() - loadingStartTime;
        const remaining = Math.max(0, minLoadingTime - elapsed);
        
        if (remaining > 0) {
          const timer = setTimeout(() => {
            setShowLoading(false);
            setLoadingStartTime(null);
          }, remaining);
          
          return () => clearTimeout(timer);
        }
      }
      
      setShowLoading(false);
      setLoadingStartTime(null);
    }
  }, [isLoading, minLoadingTime, loadingStartTime]);

  if (showLoading) {
    return fallback || <Loading />;
  }

  return <>{children}</>;
};

export default LoadingGuard;
