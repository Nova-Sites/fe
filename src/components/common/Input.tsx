import React, { forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      name,
      type,
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled,
      fullWidth = true,
      multiline,
      rows,
    },
    ref,
  ) => {
    return (
      <TextField
        inputRef={ref}
        label={label}
        error={Boolean(error)}
        helperText={error || helperText}
        className={className}
        id={id}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        InputProps={{
          startAdornment: leftIcon ? (
            <InputAdornment position="start">{leftIcon}</InputAdornment>
          ) : undefined,
          endAdornment: rightIcon ? (
            <InputAdornment position="end">{rightIcon}</InputAdornment>
          ) : undefined,
        }}
        variant="outlined"
        size="small"
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
