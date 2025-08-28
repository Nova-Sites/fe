import * as React from 'react';
import {
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { setUser, setAuthenticated } from '@/store/slices/authSlice';
import { useLoginMutation } from '@/services/auth.api';


const providers = [{ id: 'credentials', name: 'Email and Password' }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton({
  loading,
}: { loading?: boolean | null } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      disabled={Boolean(loading)}
      sx={{ my: 2 }}
    >
      {Boolean(loading) ? 'Loading...' : 'Log In'}
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/" variant="body2">
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/" variant="body2">
      Forgot password?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

type SubtitleProps = { message?: string; severity?: 'error' | 'warning' | 'info' | 'success' };

function Subtitle({ message, severity = 'warning' }: SubtitleProps) {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25, width: '100%' }} severity={severity}>
      {message ?? 'We are investigating an ongoing outage.'}
    </Alert>
  );
}

function RememberMeCheckbox() {
  const theme = useTheme();
  return (
    <FormControlLabel
      label="Remember me"
      control={
        <Checkbox
          name="remember"
          value="true"
          color="primary"
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
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthContext();
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const [apiError, setApiError] = React.useState<string | null>(null);

  const extractErrorMessage = React.useCallback((err: unknown): string => {
    const fallback = 'Login failed. Please check your credentials and try again.';
    if (!err) return fallback;
    const anyErr = err as any;
    return (
      anyErr?.data?.message ||
      anyErr?.error ||
      anyErr?.message ||
      (typeof err === 'string' ? err : undefined) ||
      fallback
    );
  }, []);

  React.useEffect(() => {
    if (error) {
      setApiError(extractErrorMessage(error));
    }
  }, [error, extractErrorMessage]);


  // Redirect if already authenticated
  React.useEffect(() => {
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
        signIn={(_provider, formData) => {
          try {
            const email = formData?.get('email') as string;
            const password = formData?.get('password') as string;

            loginMutation({ email, password })
              .unwrap()
              .then((result) => {
                if (result.success && result.data) {
                  setApiError(null);
                  dispatch(setUser(result.data.user));
                  dispatch(setAuthenticated(true));
                  navigate('/');
                }
              })
              .catch((err) => {
                const msg = extractErrorMessage(err);
                setApiError(msg);
                console.error('Login failed:', err);
              });
          } catch (err) {
            const msg = extractErrorMessage(err);
            setApiError(msg);
            console.error('Login failed:', err);
          }
        }}
        slots={{
          title: Title,
          subtitle: () => (
            <Subtitle
              message={apiError ?? undefined}
              severity={apiError ? 'error' : 'warning'}
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