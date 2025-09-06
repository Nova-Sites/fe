import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeToPx = {
  sm: 16,
  md: 32,
  lg: 48,
} as const;

const textSizeSx = {
  sm: { fontSize: 12 },
  md: { fontSize: 14 },
  lg: { fontSize: 16 },
} as const;

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  className = '',
}) => {
  return (
    <Box
      className={className}
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <CircularProgress size={sizeToPx[size]} />
      {text && (
        <Typography
          sx={{ mt: 1, color: 'text.secondary', ...textSizeSx[size] }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loading;
