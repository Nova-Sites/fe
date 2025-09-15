import React from 'react';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { TextField, InputAdornment } from '@mui/material';
import FormFieldBase from '../FormFieldBase';

interface RHFInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
  transform?: {
    input?: (value: string) => string;
    output?: (value: string) => string;
  };
}

const RHFInput = <T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  leftIcon,
  rightIcon,
  type = 'text',
  placeholder,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows,
  required = false,
  className,
  autoComplete,
  autoFocus,
  maxLength,
  min,
  max,
  step,
  pattern,
  transform,
}: RHFInputProps<T>) => {
  // Auto-detect input type and set up appropriate transform
  const getTypeTransform = (inputType: string) => {
    switch (inputType) {
      case 'number':
        return {
          input: (value: string) => value || '',
          output: (value: string) => {
            if (value === '' || value === null || value === undefined) return 0;
            const numValue = parseFloat(value);
            return isNaN(numValue) ? 0 : numValue;
          },
        };

      case 'tel':
        return {
          input: (value: string) => value || '',
          output: (value: string) => {
            // Remove non-numeric characters except +, -, (, ), space
            return value.replace(/[^\d+\-() ]/g, '');
          },
        };

      case 'email':
        return {
          input: (value: string) => value || '',
          output: (value: string) => {
            // Trim whitespace and convert to lowercase
            return value.trim().toLowerCase();
          },
        };

      case 'url':
        return {
          input: (value: string) => value || '',
          output: (value: string) => {
            // Add protocol if missing
            const trimmed = value.trim();
            if (trimmed && !trimmed.match(/^https?:\/\//)) {
              return `https://${trimmed}`;
            }
            return trimmed;
          },
        };

      case 'password':
        return {
          input: (value: string) => value || '',
          output: (value: string) => value,
        };

      default:
        return undefined;
    }
  };

  const typeTransform = getTypeTransform(type);
  const finalTransform = transform || typeTransform;

  // Auto-generate placeholder and helper text based on type
  const getTypeDefaults = (inputType: string) => {
    switch (inputType) {
      case 'email':
        return {
          placeholder: placeholder || 'example@email.com',
          helperText: helperText || 'Enter a valid email address',
          autoComplete: autoComplete || 'email',
        };
      case 'tel':
        return {
          placeholder: placeholder || '+1 (555) 123-4567',
          helperText: helperText || 'Enter a valid phone number',
          autoComplete: autoComplete || 'tel',
        };
      case 'url':
        return {
          placeholder: placeholder || 'https://example.com',
          helperText: helperText || 'Enter a valid URL',
          autoComplete: autoComplete || 'url',
        };
      case 'password':
        return {
          placeholder: placeholder || 'Enter password',
          helperText: helperText || 'Enter a secure password',
          autoComplete: autoComplete || 'current-password',
        };
      case 'number':
        return {
          placeholder: placeholder || '0',
          helperText: helperText || 'Enter a number',
          autoComplete: autoComplete || 'off',
        };
      default:
        return {
          placeholder,
          helperText,
          autoComplete,
        };
    }
  };

  const typeDefaults = getTypeDefaults(type);
  const finalPlaceholder = typeDefaults.placeholder;
  const finalHelperText = typeDefaults.helperText;
  const finalAutoComplete = typeDefaults.autoComplete;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (finalTransform?.output) {
            field.onChange(finalTransform.output(value));
          } else {
            field.onChange(value);
          }
        };

        const displayValue = finalTransform?.input
          ? finalTransform.input(field.value)
          : field.value;

        return (
          <FormFieldBase
            label={label as string}
            error={error?.message}
            helperText={finalHelperText}
            required={required}
            className={className}
            fullWidth={fullWidth}
          >
            <TextField
              {...field}
              value={displayValue}
              type={type}
              placeholder={finalPlaceholder}
              disabled={disabled}
              fullWidth={fullWidth}
              multiline={multiline}
              rows={rows}
              error={Boolean(error)}
              onChange={handleChange}
              autoComplete={finalAutoComplete}
              autoFocus={autoFocus}
              inputProps={{
                maxLength,
                min,
                max,
                step,
                pattern,
              }}
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
        );
      }}
    />
  );
};

export default RHFInput;
