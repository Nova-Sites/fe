import React from 'react';
import { Box, Paper } from '@mui/material';

interface FormBaseProps {
  onSubmit: (
    data: Record<string, FormDataEntryValue | FormDataEntryValue[]>
  ) => void;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  elevation?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const FormBase: React.FC<FormBaseProps> = ({
  onSubmit,
  children,
  className = '',
  loading = false,
  elevation = 1,
  padding = 'md',
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const data: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      const existing = data[key];
      if (existing === undefined) {
        data[key] = value;
      } else if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        data[key] = [existing, value];
      }
    }

    onSubmit(data);
  };

  const paddingMap = {
    none: 0,
    sm: 1.5,
    md: 3,
    lg: 4,
  } as const;

  return (
    <Paper elevation={elevation} className={className}>
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{ p: paddingMap[padding] }}
        noValidate
      >
        {children}
      </Box>
    </Paper>
  );
};

export default FormBase;
