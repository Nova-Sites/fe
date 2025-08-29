import React from 'react';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
}

const mapVariantToMui = (
  variant: ButtonVariant,
): { color: 'primary' | 'secondary' | 'error' | 'inherit' | 'success' | 'info' | 'warning'; muiVariant: 'text' | 'contained' | 'outlined' } => {
  switch (variant) {
    case 'outline':
      return { color: 'primary', muiVariant: 'outlined' };
    case 'ghost':
      return { color: 'primary', muiVariant: 'text' };
    case 'secondary':
      return { color: 'secondary', muiVariant: 'contained' };
    case 'danger':
      return { color: 'error', muiVariant: 'contained' };
    case 'primary':
    default:
      return { color: 'primary', muiVariant: 'contained' };
  }
};

const mapSizeToMui = (size: ButtonSize): 'small' | 'medium' | 'large' => {
  switch (size) {
    case 'sm':
      return 'small';
    case 'lg':
      return 'large';
    case 'md':
    default:
      return 'medium';
  }
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  fullWidth,
  onClick,
  type = 'button',
}) => {
  const { color, muiVariant } = mapVariantToMui(variant);
  const muiSize = mapSizeToMui(size);

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      size={muiSize}
      fullWidth={fullWidth}
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
