import React, { createContext, useContext, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setUser, setAuthenticated, clearAuth } from '@/store/slices/authSlice';
import { useGetProfileQuery } from '@/services/auth.api';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Ref để track nếu đã thử fetch profile
  const hasAttemptedProfileFetch = useRef(false);
  const isInitialized = useRef(false);
  
  // Sử dụng useMemo để tránh tính toán lại mỗi lần render
  const shouldFetchProfile = useMemo(() => {
    // Nếu đã có user, không cần fetch profile
    if (user) {
      return false;
    }
    
    // Chỉ fetch profile một lần khi mount và chưa có user
    return !hasAttemptedProfileFetch.current && !isInitialized.current;
  }, [user]);
  
  const { 
    data: profileData, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useGetProfileQuery(undefined, {
    skip: !shouldFetchProfile,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Khởi tạo authentication chỉ một lần
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      console.log('AuthContext initialized');
    }
  }, []);

  // Handle profile data changes - chỉ chạy khi có data hoặc error
  useEffect(() => {
    if (profileData?.success && profileData.data) {
      console.log('Profile fetched successfully:', profileData.data);
      dispatch(setUser(profileData.data));
      dispatch(setAuthenticated(true));
      hasAttemptedProfileFetch.current = true;
    } else if (profileError) {
      console.log('Profile fetch failed:', profileError);
      // Nếu profile fetch fails, user không authenticated
      dispatch(clearAuth());
      hasAttemptedProfileFetch.current = true;
    }
  }, [profileData, profileError, dispatch]);

  // Reset profile fetch attempt khi user thay đổi
  useEffect(() => {
    if (user) {
      hasAttemptedProfileFetch.current = false;
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    // Keep loading true until we have definitively attempted profile fetch
    // and resolved the auth state. This avoids guard redirects during init.
    isLoading: user ? false : (isProfileLoading || !hasAttemptedProfileFetch.current),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
