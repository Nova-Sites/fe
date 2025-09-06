import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import {
  setUser,
  setToken,
  clearAuth,
  setError,
  clearError,
  setLoading,
  setAuthenticated,
} from '@/store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useVerifyOTPMutation,
  useResendOTPMutation,
} from '@/services/auth.api';
import type { LoginCredentials, RegisterData } from '@/types';
import { USER_ROLES } from '@/constants';

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Ref để track nếu đã thử fetch profile
  const hasAttemptedProfileFetch = useRef(false);
  const isInitialized = useRef(false);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [verifyOTPMutation, { isLoading: isVerifyOTPLoading }] =
    useVerifyOTPMutation();
  const [resendOTPMutation, { isLoading: isResendOTPLoading }] =
    useResendOTPMutation();

  // Chỉ fetch profile một lần khi mount và chưa có user
  const shouldFetchProfile =
    !user && !hasAttemptedProfileFetch.current && !isInitialized.current;

  // Computed values
  const isAdmin =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN;
  const isSuperAdmin = user?.role === USER_ROLES.SUPER_ADMIN;

  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
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
      // Nếu không có user và chưa thử fetch, RTK Query sẽ tự động fetch
      if (!user && !hasAttemptedProfileFetch.current) {
        hasAttemptedProfileFetch.current = true;
      }
    }
  }, [user]);

  // Handle profile data changes - chỉ chạy khi có data hoặc error
  useEffect(() => {
    if (profileData?.success && profileData.data) {
      dispatch(setUser(profileData.data));
      dispatch(setAuthenticated(true));
      dispatch(setToken('authenticated')); // Backend quản lý cookies
      hasAttemptedProfileFetch.current = true;
    } else if (profileError) {
      // Nếu profile fetch fails, user không authenticated
      dispatch(clearAuth());
      hasAttemptedProfileFetch.current = true;
    }
  }, [profileData, profileError, dispatch]);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const result = await loginMutation(credentials).unwrap();

      if (result.success && result.data) {
        const checkAdmin =
          result.data.user.role === USER_ROLES.ADMIN ||
          result.data.user.role === USER_ROLES.SUPER_ADMIN;
        dispatch(setUser(result.data.user));
        dispatch(setToken('authenticated'));
        dispatch(setAuthenticated(true));
        // Reset profile fetch attempt
        hasAttemptedProfileFetch.current = false;
        if (checkAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return { success: true };
      } else {
        dispatch(setError(result.message || 'Login failed'));
        return { success: false, error: result.message };
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.message || apiError?.message || 'Login failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const result = await registerMutation(data).unwrap();

      if (result.success && result.data) {
        // Registration không tự động login, chỉ hiển thị success message
        dispatch(setError('')); // Clear any errors
        return { success: true };
      } else {
        dispatch(setError(result.message || 'Registration failed'));
        return { success: false, error: result.message };
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.message || apiError?.message || 'Registration failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
      // Backend sẽ clear cookies tự động
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(clearAuth());
      // Reset profile fetch attempt
      hasAttemptedProfileFetch.current = false;
      navigate('/login');
    }
  };

  const updateProfile = () => {
    if (profileData?.success && profileData.data) {
      dispatch(setUser(profileData.data));
    }
  };

  // Manual refetch function for when needed
  const refetchProfile = useCallback(async () => {
    hasAttemptedProfileFetch.current = false;
    // Force refetch by updating the query
    window.location.reload();
  }, []);

  const verifyOTP = async (otp: string, email: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const result = await verifyOTPMutation({ otp, email }).unwrap();

      if (result.success && result.data) {
        dispatch(setUser(result.data.user));
        dispatch(setAuthenticated(true));
        dispatch(setToken('authenticated'));
        return { success: true };
      } else {
        dispatch(setError(result.message || 'OTP verification failed'));
        return { success: false, error: result.message };
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.message ||
        apiError?.message ||
        'OTP verification failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resendOTP = async (email: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const result = await resendOTPMutation({ email }).unwrap();

      if (result.success) {
        return { success: true };
      } else {
        dispatch(setError(result.message || 'Failed to resend OTP'));
        return { success: false, error: result.message };
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.data?.message || apiError?.message || 'Failed to resend OTP';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    token,
    isLoading:
      isLoading ||
      isLoginLoading ||
      isRegisterLoading ||
      isLogoutLoading ||
      isProfileLoading ||
      isVerifyOTPLoading ||
      isResendOTPLoading,
    error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    refetchProfile,
    verifyOTP,
    resendOTP,
    clearError: () => dispatch(clearError()),

    // Computed values
    isAdmin,
    isSuperAdmin,
  };
};
