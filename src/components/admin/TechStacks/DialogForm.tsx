import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver as RHFResolver } from 'react-hook-form';
import { Box } from '@mui/material';
import {
  DialogBase,
  RHFInput,
  RHFTextArea,
  RHFFileUpload,
  AlertBase,
  ActionButtonsBase,
  useRHFForm,
} from '@/components/common';
import { TechStack } from '@/types';
import {
  techStackSchemas,
  TechStackCreateInput,
} from '@/utils/validation/schemas';

interface DialogFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TechStackCreateInput) => Promise<void>;
  techStack?: TechStack | null;
  loading?: boolean;
}

const DialogForm: React.FC<DialogFormProps> = ({
  open,
  onClose,
  onSubmit,
  techStack = null,
  loading = false,
}) => {
  const [submitError, setSubmitError] = useState<string>('');
  const isEdit = Boolean(techStack?.id);

  // Default values for form
  const defaultValues = {
    name: '',
    description: '',
    iconUrl: '',
    slug: '',
    isActive: true,
  } as unknown as TechStackCreateInput;

  // Use RHF form
  const computedResolver = (zodResolver as unknown as (s: unknown) => unknown)(
    techStackSchemas.create
  ) as unknown as RHFResolver<
    TechStackCreateInput,
    unknown,
    TechStackCreateInput
  >;

  const form = useRHFForm<TechStackCreateInput>({
    resolver: computedResolver,
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = form;

  // Reset form when product prop changes
  React.useEffect(() => {
    if (techStack) {
      // Edit mode - populate form with product data
      reset({
        name: techStack.name || '',
        slug: techStack.slug || '',
        description: techStack.description || '',
        iconUrl: techStack.iconUrl || '',
        isActive: techStack.isActive,
      });
    } else {
      // Create mode - reset to empty values
      reset({
        name: '',
        slug: '',
        description: '',
        iconUrl: '',
        isActive: true,
      });
    }
  }, [techStack, reset]);

  // Auto-generate slug from name
  const nameValue = watch('name');
  React.useEffect(() => {
    if (nameValue && !isEdit) {
      const slug = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [nameValue, setValue, isEdit]);

  const handleFormSubmit = async (data: TechStackCreateInput) => {
    try {
      setSubmitError('');
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving the product'
      );
    }
  };

  const handleSubmitWithValidation = async (data: TechStackCreateInput) => {
    console.log(
      '🚀 ProductDialogForm: handleSubmitWithValidation called with data:',
      data
    );
    console.log('🚀 ProductDialogForm: Current form errors:', errors);
    console.log('🚀 ProductDialogForm: Form isValid:', isValid);

    await handleFormSubmit(data);
  };

  const handleClose = () => {
    if (!loading) {
      setSubmitError('');
      reset();
      onClose();
    }
  };

  return (
    <DialogBase
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit Tech Stack' : 'Create New Tech Stack'}
      maxWidth='md'
      fullWidth
    >
      <Box
        component='form'
        onSubmit={handleSubmit(handleSubmitWithValidation)}
        sx={{ p: 3 }}
        noValidate
      >
        {submitError && <AlertBase severity='error'>{submitError}</AlertBase>}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            mb: 2,
          }}
        >
          <RHFInput
            name='name'
            control={control}
            label='Tech Stack Name'
            placeholder='e.g., React, Node.js'
            helperText='Enter a descriptive name for the product'
            required
            disabled={loading}
          />

          <RHFInput
            name='slug'
            control={control}
            label='Slug'
            placeholder='e.g., react, node-js'
            helperText='URL-friendly identifier (auto-generated from name)'
            required
            disabled={loading}
          />
        </Box>

        <RHFTextArea
          name='description'
          control={control}
          label='Description'
          placeholder='Describe the tech stack features, technologies used, and what makes it special...'
          helperText='Provide a detailed description of the tech stack'
          rows={4}
          required
          disabled={loading}
        />

        {/* Main Image */}
        <RHFFileUpload
          name='iconUrl'
          control={control}
          label='Icon URL'
          helperText='Upload the main tech stack icon (max 5MB)'
          accept='image/*'
          maxSize={5}
          preview={true}
          multiple={false}
          disabled={loading}
          required
        />

        <ActionButtonsBase
          onSave={() => {
            console.log('🔘 ProductDialogForm: Save button clicked');
            console.log(
              '🔘 ProductDialogForm: Form state - isValid:',
              isValid,
              'errors:',
              errors
            );
            handleSubmit(handleSubmitWithValidation)();
          }}
          onCancel={handleClose}
          loading={isSubmitting || loading}
          saveText={isEdit ? 'Update Tech Stack' : 'Create Tech Stack'}
          cancelText='Cancel'
          justifyContent='flex-end'
          spacing={2}
        />
      </Box>
    </DialogBase>
  );
};

export default DialogForm;
