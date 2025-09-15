import React from 'react';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { TextField, InputAdornment } from '@mui/material';
import FormFieldBase from '../FormFieldBase';

interface RHFTextAreaProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  required?: boolean;
  className?: string;
}

const RHFTextArea = <T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  leftIcon,
  rightIcon,
  placeholder,
  disabled = false,
  fullWidth = true,
  rows = 4,
  minRows,
  maxRows,
  required = false,
  className,
}: RHFTextAreaProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormFieldBase
          label={label as string}
          error={error?.message}
          helperText={helperText}
          required={required}
          className={className}
          fullWidth={fullWidth}
        >
          <TextField
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth={fullWidth}
            multiline
            rows={rows}
            minRows={minRows}
            maxRows={maxRows}
            error={Boolean(error)}
            InputProps={{
              startAdornment: leftIcon ? (
                <InputAdornment position='start'>{leftIcon}</InputAdornment>
              ) : undefined,
              endAdornment: rightIcon ? (
                <InputAdornment position='end'>{rightIcon}</InputAdornment>
              ) : undefined,
            }}
            variant='outlined'
            size='small'
          />
        </FormFieldBase>
      )}
    />
  );
};

export default RHFTextArea;
