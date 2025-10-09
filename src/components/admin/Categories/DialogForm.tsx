import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Category } from '@/types';
import {
  categorySchemas,
  CategoryCreateInput,
} from '@/utils/validation/schemas';

interface DialogFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryCreateInput) => Promise<void>;
  category?: Category | null;
  loading?: boolean;
}

const DialogForm: React.FC<DialogFormProps> = ({
  open,
  onClose,
  onSubmit,
  category = null,
  loading = false,
}) => {
  const [submitError, setSubmitError] = useState<string>('');
  const isEdit = Boolean(category?.id);

  // Default values for form
  const defaultValues: CategoryCreateInput = {
    name: '',
    description: '',
    slug: '',
    image: '' as File | string,
  };

  // Use RHF form
  const form = useRHFForm<CategoryCreateInput>({
    resolver: zodResolver(categorySchemas.create),
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Reset form when category prop changes
  React.useEffect(() => {
    if (category) {
      // Edit mode - populate form with category data
      reset({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image: category.image || ('' as string),
      });
    } else {
      // Create mode - reset to empty values
      reset({
        name: '',
        slug: '',
        description: '',
        image: '' as File | string,
      });
    }
  }, [category, reset]);

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

  const handleFormSubmit = async (data: CategoryCreateInput) => {
    try {
      setSubmitError('');
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving the category'
      );
    }
  };

  const handleSubmitWithValidation = async (data: CategoryCreateInput) => {
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
      title={isEdit ? 'Edit Category' : 'Create New Category'}
      maxWidth='sm'
      fullWidth
    >
      <Box
        component='form'
        onSubmit={handleSubmit(handleSubmitWithValidation)}
        sx={{ p: 3 }}
        noValidate
      >
        {submitError && <AlertBase severity='error'>{submitError}</AlertBase>}

        <RHFInput
          name='name'
          control={control}
          label='Category Name'
          placeholder='e.g., Electronics, Clothing, Books'
          helperText='Enter a unique name for the category'
          required
          disabled={loading}
        />

        <RHFInput
          name='slug'
          control={control}
          label='Slug'
          placeholder='e.g., electronics, clothing, books'
          helperText='URL-friendly identifier (auto-generated from name)'
          required
          disabled={loading}
        />

        <RHFTextArea
          name='description'
          control={control}
          label='Description'
          placeholder='Describe what products belong to this category...'
          helperText='Provide a detailed description of the category'
          rows={4}
          required
          disabled={loading}
        />

        <RHFFileUpload
          name='image'
          control={control}
          label='Category Image'
          helperText='Upload an image for the category (max 5MB)'
          accept='image/*'
          maxSize={5}
          preview={true}
          multiple={false}
          disabled={loading}
          required
        />

        <ActionButtonsBase
          onSave={() => {
            handleSubmit(handleSubmitWithValidation)();
          }}
          onCancel={handleClose}
          loading={isSubmitting || loading}
          saveText={isEdit ? 'Update Category' : 'Create Category'}
          cancelText='Cancel'
          justifyContent='flex-end'
          spacing={2}
        />
      </Box>
    </DialogBase>
  );
};

export default DialogForm;
