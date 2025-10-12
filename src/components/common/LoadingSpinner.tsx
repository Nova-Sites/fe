import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

/**
 * 🔄 Loading Spinner Component
 * Consistent loading UI across the app
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 40,
}) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      minHeight='200px'
      gap={2}
    >
      <CircularProgress size={size} />
      <Typography variant='body2' color='text.secondary'>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
