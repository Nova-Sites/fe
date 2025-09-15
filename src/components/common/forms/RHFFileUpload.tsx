import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import FileUploadBase from '../FileUploadBase';
import FormFieldBase from '../FormFieldBase';

interface RHFFileUploadProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number;
  preview?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  required?: boolean;
  className?: string;
}

const RHFFileUpload = <T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  accept = 'image/*',
  maxSize = 5,
  preview = true,
  multiple = false,
  disabled = false,
  maxFiles = 5,
  required = false,
  className,
}: RHFFileUploadProps<T>) => {
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
          fullWidth
        >
          <FileUploadBase
            onFileSelect={field.onChange}
            accept={accept}
            maxSize={maxSize}
            preview={preview}
            multiple={multiple}
            disabled={disabled}
            maxFiles={maxFiles}
            label=''
          />
        </FormFieldBase>
      )}
    />
  );
};

export default RHFFileUpload;
