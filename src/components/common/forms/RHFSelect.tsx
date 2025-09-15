import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import FormFieldBase from '../FormFieldBase';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface RHFSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  className?: string;
}

const RHFSelect = <T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  options,
  placeholder,
  disabled = false,
  fullWidth = true,
  required = false,
  className,
}: RHFSelectProps<T>) => {
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
          <FormControl
            fullWidth={fullWidth}
            error={Boolean(error)}
            disabled={disabled}
            required={required}
            size='small'
          >
            {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
            <MuiSelect
              {...field}
              labelId={`${name}-label`}
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
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        </FormFieldBase>
      )}
    />
  );
};

export default RHFSelect;
