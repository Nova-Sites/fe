import * as React from 'react';
import { Checkbox, FormControlLabel, Alert, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  Button as CommonButton,
  Input as CommonInput,
} from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import type { ApiErrorResponse } from '@/services/api.config';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

function CustomEmailField() {
  return (
    <CommonInput
      label='Email'
      id='email'
      name='email'
      type='email'
      fullWidth
      leftIcon={<AccountCircle fontSize='inherit' />}
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <CommonInput
      label='Password'
      id='password'
      name='password'
      type={showPassword ? 'text' : 'password'}
      fullWidth
      rightIcon={
        <IconButton
          aria-label='toggle password visibility'
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          edge='end'
          size='small'
        >
          {showPassword ? (
            <VisibilityOff fontSize='inherit' />
          ) : (
            <Visibility fontSize='inherit' />
          )}
        </IconButton>
      }
    />
  );
}

function CustomButton({ loading }: { loading?: boolean | null }) {
  return (
    <CommonButton
      type='submit'
      variant='outline'
      size='md'
      fullWidth
      loading={Boolean(loading)}
      className='!my-2'
    >
      Log In
    </CommonButton>
  );
}

function SignUpLink() {
  return (
    <Link to='/register' className='text-[#0288d1] text-sm underline'>
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link to='/' className='text-[#0288d1] text-sm'>
      Forgot password?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

type SubtitleProps = {
  message?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
};

function Subtitle({ message, severity = 'warning' }: SubtitleProps) {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25, width: '100%' }} severity={severity}>
      {message ?? 'Please login with email and password'}
    </Alert>
  );
}

function RememberMeCheckbox() {
  const theme = useTheme();
  return (
    <FormControlLabel
      label='Remember me'
      control={
        <Checkbox
          name='remember'
          value='true'
          color='primary'
          sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
        />
      }
      slotProps={{
        typography: {
          color: 'textSecondary',
          fontSize: theme.typography.pxToRem(14),
        },
      }}
    />
  );
}

export default function SlotsSignIn() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, isAdmin, isLoading } = useAuth();
  const { isAuthenticated } = useAuthContext();
  const [apiError, setApiError] = React.useState<string | null>(null);

  const extractErrorMessage = React.useCallback((err: unknown): string => {
    const fallback =
      'Login failed. Please check your credentials and try again.';
    if (!err) return fallback;
    const anyErr = err as Partial<ApiErrorResponse>;
    return (
      anyErr?.data?.message ||
      anyErr?.error ||
      anyErr?.message ||
      (typeof err === 'string' ? err : undefined) ||
      fallback
    );
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, isAdmin]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={async (_provider, formData) => {
          try {
            const email = formData?.get('email') as string;
            const password = formData?.get('password') as string;
            const result = await login({ email, password });
            if (!result.success && result.error)
              setApiError(extractErrorMessage(result.error));
            return { status: 'success' };
          } catch (err) {
            console.error('Login failed:', err);
            return {
              status: 'error',
              error: extractErrorMessage(err),
            };
          }
        }}
        slots={{
          title: Title,
          subtitle: () => (
            <Subtitle
              message={apiError ?? undefined}
              severity={apiError ? 'error' : 'info'}
            />
          ),
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
          rememberMe: RememberMeCheckbox,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        slotProps={{
          form: { noValidate: true },
          submitButton: { loading: isLoading },
        }}
        providers={providers}
      />
    </AppProvider>
  );
}
