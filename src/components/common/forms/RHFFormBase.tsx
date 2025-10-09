import React from 'react';
import {
  useForm,
  UseFormProps,
  FieldValues,
  Resolver,
  SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
import { Box, Paper } from '@mui/material';
import ActionButtonsBase from '../ActionButtonsBase';

interface RHFFormBaseProps<T extends FieldValues> extends UseFormProps<T> {
  children: React.ReactNode;
  onSubmit: (data: T) => void | Promise<void>;
  schema?: unknown;
  resolver?: Resolver<T>;
  className?: string;
  elevation?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  showActions?: boolean;
  saveText?: string;
  cancelText?: string;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const RHFFormBase = <T extends FieldValues>({
  children,
  onSubmit,
  schema,
  className = '',
  elevation = 1,
  padding = 'md',
  showActions = true,
  saveText = 'Save',
  cancelText = 'Cancel',
  onCancel,
  loading = false,
  disabled = false,
  ...formProps
}: RHFFormBaseProps<T>) => {
  const computedResolver: Resolver<T> | undefined =
    (formProps as { resolver?: Resolver<T> }).resolver ??
    (schema
      ? ((zodResolver as unknown as (s: unknown) => unknown)(
          schema
        ) as Resolver<T>)
      : undefined);

  const form = useForm<T>({
    // Spread first so our resolver overrides any provided one without unused vars
    ...formProps,
    resolver: computedResolver,
    mode: 'onBlur', // Validate on blur (when user leaves field)
    reValidateMode: 'onChange', // Re-validate on change after first validation
    // Override mode if provided in formProps
    // mode: formProps.mode || 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const handleFormSubmit: SubmitHandler<T> = async data => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('❌ RHFFormBase: Form submission error:', error);
    }
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
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ p: paddingMap[padding] }}
        noValidate
      >
        {children}

        {showActions && (
          <ActionButtonsBase
            onSave={() => {
              handleSubmit(handleFormSubmit)();
            }}
            onCancel={onCancel || (() => {})}
            loading={isSubmitting || loading}
            disabled={disabled}
            saveText={saveText}
            cancelText={cancelText}
            justifyContent='flex-end'
            spacing={2}
          />
        )}
      </Box>
    </Paper>
  );
};

// Export form context and hook for advanced usage
export const useRHFForm = <T extends FieldValues>(props?: UseFormProps<T>) => {
  return useForm<T>(props);
};

export default RHFFormBase;
