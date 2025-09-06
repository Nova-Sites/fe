import React, { ButtonHTMLAttributes, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { IconButton, Alert, Box } from '@mui/material';
import {
  Button as CommonButton,
  Input as CommonInput,
} from '@/components/common';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ApiErrorResponse } from '@/services';
import { useAuth } from '@/hooks';

const providers = [{ id: 'credentials', name: 'Email, Username and Password' }];

function Title() {
  return (
    <h2 style={{ marginBottom: 8 }} className='font-bold text-3xl'>
      Create account
    </h2>
  );
}

function EmailAndUsernameFields() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CommonInput
        id='email'
        label='Email'
        name='email'
        type='email'
        fullWidth
        leftIcon={<AccountCircle fontSize='inherit' />}
      />
      <CommonInput
        id='username'
        label='Username'
        name='username'
        fullWidth
        leftIcon={<AccountCircle fontSize='inherit' />}
      />
    </Box>
  );
}

function SinglePasswordField({
  id = 'password',
  name = 'password',
  label = 'Password',
}: {
  id?: string;
  name: string;
  label?: string;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };
  return (
    <CommonInput
      label={label}
      name={name}
      id={id}
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

function PasswordAndConfirmFields() {
  return (
    <>
      <SinglePasswordField id='password' name='password' label='Password' />
      <SinglePasswordField
        id='confirm-password'
        name='confirmPassword'
        label='Confirm Password'
      />
    </>
  );
}

function SubmitButton({ loading }: { loading?: boolean | null }) {
  return (
    <CommonButton
      type='submit'
      variant='outline'
      size='md'
      fullWidth
      loading={Boolean(loading)}
      className='!mb-2 !mt-4'
    >
      Create account
    </CommonButton>
  );
}

type SubtitleProps = {
  message?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
};

function Subtitle({ message, severity = 'warning' }: SubtitleProps) {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25, width: '100%' }} severity={severity}>
      {message ?? 'Fill the form below to create your account.'}
    </Alert>
  );
}

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { isAuthenticated } = useAuthContext();
  const [apiError, setApiError] = React.useState<string | null>(null);

  const extractErrorMessage = React.useCallback((err: unknown): string => {
    const fallback =
      'Registration failed. Please check your details and try again.';
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={async (_provider, formData) => {
          try {
            const username = formData?.get('username') as string;
            const email = formData?.get('email') as string;
            const password = formData?.get('password') as string;
            const confirmPassword = formData?.get('confirmPassword') as string;

            if (!username || !email || !password || !confirmPassword) {
              setApiError('Please fill in all fields.');
              return { status: 'error' };
            }
            if (password !== confirmPassword) {
              setApiError('Passwords do not match.');
              return { status: 'error' };
            }

            const result = await register({ username, email, password });
            if (result.success) {
              // Redirect to OTP verification page
              navigate('/verify-otp', {
                state: { email, username, from: '/login' },
              });
              return { status: 'success' };
            } else if (result.error) {
              setApiError(extractErrorMessage(result.error));
              return { status: 'error' };
            }
            return { status: 'error' };
          } catch (err) {
            console.error('Registration failed:', err);
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
          emailField: EmailAndUsernameFields,
          passwordField: PasswordAndConfirmFields,

          submitButton: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
            <SubmitButton loading={isLoading} {...props} />
          ),
          signUpLink: () => (
            <div className='text-sm'>
              Already have an account?{' '}
              <Link to='/login' className='ml-2 text-[#0288d1] underline'>
                Sign in
              </Link>
            </div>
          ),
          // remove extra slots to keep field order clean
        }}
        slotProps={{
          form: { noValidate: true },
          submitButton: { loading: isLoading },
        }}
        providers={providers}
      />
    </AppProvider>
  );
};

export default RegisterPage;
