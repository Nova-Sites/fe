import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { useAuth } from '@/hooks';
import { Button as CommonButton } from '@/components/common';

interface LocationState {
  email?: string;
  username?: string;
  from?: string;
}

const OTPVerificationPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP, isLoading } = useAuth();

  const state = location.state as LocationState;
  const email = state?.email || '';
  const from = state?.from || '/';

  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Start countdown when component mounts
  useEffect(() => {
    setCountdown(60); // 60 seconds countdown
  }, []);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Function to clear all OTP fields
  const clearAllOtp = () => {
    setOtp('');
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setError(null);
      const result = await verifyOTP(otp);

      if (result.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      setIsResending(true);
      setError(null);

      const result = await resendOTP(email);

      if (result.success) {
        setSuccess('OTP sent successfully!');
        setCountdown(60); // Reset countdown
        setOtp(''); // Clear OTP input
      } else {
        setError(result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <AppProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            padding: 4,
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant='h4' component='h1' fontWeight='bold'>
              Verify Email
            </Typography>
          </Box>

          {/* Description */}
          <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
            We've sent a 6-digit verification code to:
          </Typography>

          <Typography
            variant='body1'
            fontWeight='medium'
            sx={{ mb: 4, color: 'primary.main' }}
          >
            {email}
          </Typography>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity='success' sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* OTP Input */}
          <Box sx={{ mb: 3 }}>
            <MuiOtpInput
              value={otp}
              onChange={handleOtpChange}
              length={6}
              sx={{
                '& .MuiOtpInput-TextField': {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey.300',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Verify Button */}
          <CommonButton
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
            loading={isLoading}
            fullWidth
            size='lg'
            className='!mb-3'
          >
            Verify Email
          </CommonButton>

          {/* Clear All Button */}
          {otp.length > 0 && (
            <Button
              onClick={clearAllOtp}
              variant='text'
              size='small'
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                mb: 2,
              }}
            >
              Clear All
            </Button>
          )}

          {/* Resend Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
              Didn't receive the code?
            </Typography>

            <Button
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              startIcon={
                isResending ? <CircularProgress size={16} /> : <Refresh />
              }
              sx={{
                textTransform: 'none',
                color: countdown > 0 ? 'text.disabled' : 'primary.main',
              }}
            >
              {countdown > 0
                ? `Resend in ${countdown}s`
                : isResending
                  ? 'Sending...'
                  : 'Resend Code'}
            </Button>
          </Box>

          {/* Help Text */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant='caption' color='text.secondary'>
              Check your spam folder if you don't see the email
            </Typography>
          </Box>
        </Box>
      </Box>
    </AppProvider>
  );
};

export default OTPVerificationPage;
