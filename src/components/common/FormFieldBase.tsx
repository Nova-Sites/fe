import React from 'react';
import { Box, Typography, FormControl } from '@mui/material';

interface FormFieldBaseProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const FormFieldBase: React.FC<FormFieldBaseProps> = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className,
  fullWidth = true,
}) => {
  const hasError = Boolean(error);

  return (
    <FormControl fullWidth={fullWidth} error={hasError} className={className}>
      <Box sx={{ mb: 1 }}>
        <Typography
          variant='body2'
          component='label'
          sx={{
            fontWeight: 500,
            color: hasError ? 'error.main' : 'text.primary',
          }}
        >
          {label}
          {required && (
            <Typography component='span' sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
      </Box>

      <Box>{children}</Box>

      {(error || helperText) && (
        <Typography
          variant='caption'
          color={hasError ? 'error' : 'text.secondary'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {error || helperText}
        </Typography>
      )}
    </FormControl>
  );
};

export default FormFieldBase;
