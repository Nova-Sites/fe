import React from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

type Severity = 'success' | 'info' | 'warning' | 'error';

interface AlertProps {
  severity?: Severity;
  children: React.ReactNode;
  /**
   * If provided, renders inside a Snackbar for floating notifications
   */
  useSnackbar?: boolean;
  open?: boolean;
  onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  autoHideDuration?: number;
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
  variant?: 'standard' | 'filled' | 'outlined';
}

const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  children,
  useSnackbar = false,
  open = true,
  onClose,
  autoHideDuration = 4000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  variant = 'standard',
}) => {
  if (useSnackbar) {
    return (
      <Snackbar
        open={open}
        onClose={onClose}
        autoHideDuration={autoHideDuration}
        anchorOrigin={anchorOrigin}
      >
        <MuiAlert onClose={onClose as any} severity={severity} variant={variant} sx={{ width: '100%' }}>
          {children}
        </MuiAlert>
      </Snackbar>
    );
  }

  return (
    <MuiAlert severity={severity} variant={variant} onClose={onClose as any}>
      {children}
    </MuiAlert>
  );
};

export default Alert;


