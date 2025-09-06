import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
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
  // const username = state?.username || '';
  const from = state?.from || '/';

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, 6);
        if (pastedOtp.length === 6) {
          const newOtp = pastedOtp.split('');
          setOtp(newOtp);
          inputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setError(null);
      const result = await verifyOTP(otpString);

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
        setOtp(new Array(6).fill('')); // Clear OTP inputs
        inputRefs.current[0]?.focus(); // Focus first input
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 1,
              mb: 3,
            }}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                ref={el => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  },
                }}
                sx={{
                  width: 50,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: digit ? 'primary.main' : 'grey.300',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            ))}
          </Box>

          {/* Verify Button */}
          <CommonButton
            onClick={handleVerify}
            disabled={isLoading || otp.join('').length !== 6}
            loading={isLoading}
            fullWidth
            size='lg'
            className='!mb-3'
          >
            Verify Email
          </CommonButton>

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
