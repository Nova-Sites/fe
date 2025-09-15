import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectBaseProps {
  name?: string;
  label?: string;
  value?: string | number;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  size?: 'small' | 'medium';
  className?: string;
}

const SelectBase: React.FC<SelectBaseProps> = ({
  name,
  label,
  value = '',
  options,
  onChange,
  error,
  helperText,
  placeholder,
  disabled = false,
  fullWidth = true,
  required = false,
  size = 'small',
  className,
}) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value);
  };

  const hasError = Boolean(error);

  return (
    <FormControl
      fullWidth={fullWidth}
      error={hasError}
      disabled={disabled}
      required={required}
      size={size}
      className={className}
    >
      {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
      <MuiSelect
        labelId={`${name}-label`}
        name={name}
        value={value}
        onChange={handleChange}
        label={label}
        displayEmpty
        renderValue={selected => {
          if (!selected) {
            return (
              <span style={{ color: '#999' }}>
                {placeholder || 'Select an option'}
              </span>
            );
          }
          const option = options.find(opt => opt.value === selected);
          return option?.label || selected;
        }}
      >
        {placeholder && (
          <MenuItem value='' disabled>
            <span style={{ color: '#999' }}>{placeholder}</span>
          </MenuItem>
        )}
        {options.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectBase;
