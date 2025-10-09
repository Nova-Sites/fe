import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver as RHFResolver } from 'react-hook-form';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  DialogBase,
  RHFInput,
  RHFTextArea,
  RHFFileUpload,
  RHFSelect,
  AlertBase,
  ActionButtonsBase,
  useRHFForm,
} from '@/components/common';
import { Product, Category, TechStack } from '@/types';
import { productSchemas, ProductCreateInput } from '@/utils/validation/schemas';

interface DialogFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductCreateInput) => Promise<void>;
  product?: Product | null;
  categories: Category[];
  techStacks: TechStack[];
  loading?: boolean;
}

const DialogForm: React.FC<DialogFormProps> = ({
  open,
  onClose,
  onSubmit,
  product = null,
  categories = [],
  techStacks = [],
  loading = false,
}) => {
  const [submitError, setSubmitError] = useState<string>('');
  const isEdit = Boolean(product?.id);

  // Default values for form
  const defaultValues = {
    name: '',
    description: '',
    videoUrl: '',
    slug: '',
    price: 0,
    categoryId: 0,
    image: '' as File | string,
    images: [],
    techStackIds: [],
    isActive: true,
  } as unknown as ProductCreateInput;

  // Use RHF form
  const computedResolver = (zodResolver as unknown as (s: unknown) => unknown)(
    productSchemas.create
  ) as unknown as RHFResolver<ProductCreateInput, unknown, ProductCreateInput>;

  const form = useRHFForm<ProductCreateInput>({
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
    formState: { isSubmitting, errors },
  } = form;

  // Reset form when product prop changes
  React.useEffect(() => {
    if (product) {
      // Edit mode - populate form with product data
      reset({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        videoUrl: product.videoUrl || '',
        price: product.price || 0,
        categoryId: product.categoryId || 0,
        image: product.image || ('' as string),
        images: product.images?.map(img => img.url) || [],
        techStackIds: product.techStacks?.map(tech => tech.id) || [],
        isActive: product.isActive,
      });
    } else {
      // Create mode - reset to empty values
      reset({
        name: '',
        slug: '',
        description: '',
        videoUrl: '',
        price: 0,
        categoryId: 0,
        image: '' as File | string,
        images: [],
        techStackIds: [],
        isActive: true,
      });
    }
  }, [product, reset]);

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

  const handleFormSubmit = async (data: ProductCreateInput) => {
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

  const handleSubmitWithValidation = async (data: ProductCreateInput) => {
    await handleFormSubmit(data);
  };

  const handleClose = () => {
    if (!loading) {
      setSubmitError('');
      reset();
      onClose();
    }
  };

  // Watch tech stack IDs for multi-select
  const selectedTechStackIds = watch('techStackIds') || [];

  return (
    <DialogBase
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit Product' : 'Create New Product'}
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
            label='Product Name'
            placeholder='e.g., E-commerce Website, Mobile App'
            helperText='Enter a descriptive name for the product'
            required
            disabled={loading}
          />

          <RHFInput
            name='slug'
            control={control}
            label='Slug'
            placeholder='e.g., ecommerce-website, mobile-app'
            helperText='URL-friendly identifier (auto-generated from name)'
            required
            disabled={loading}
          />
        </Box>

        <RHFInput
          name='videoUrl'
          control={control}
          label='Video URL'
          placeholder='e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          helperText='Enter the video URL'
          required
          disabled={loading}
        />

        <RHFTextArea
          name='description'
          control={control}
          label='Description'
          placeholder='Describe the product features, technologies used, and what makes it special...'
          helperText='Provide a detailed description of the product'
          rows={4}
          required
          disabled={loading}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            mb: 2,
          }}
        >
          <RHFInput
            name='price'
            control={control}
            label='Price'
            type='number'
            placeholder='0.00'
            helperText='Enter the price in USD'
            required
            disabled={loading}
          />

          <RHFSelect
            name='categoryId'
            control={control}
            label='Category'
            options={categories.map(cat => ({
              value: cat.id,
              label: cat.name,
            }))}
            placeholder='Select a category'
            helperText='Choose the product category'
            required
            disabled={loading}
          />
        </Box>

        {/* Tech Stacks Multi-Select */}
        <FormControl fullWidth error={!!errors.techStackIds} sx={{ mb: 2 }}>
          <InputLabel id='tech-stacks-label'>Tech Stacks</InputLabel>
          <Select
            labelId='tech-stacks-label'
            multiple
            value={selectedTechStackIds}
            onChange={e => {
              const value =
                typeof e.target.value === 'string'
                  ? e.target.value.split(',').map(id => parseInt(id))
                  : e.target.value;
              setValue('techStackIds', value, { shouldValidate: true });
            }}
            input={<OutlinedInput label='Tech Stacks' />}
            renderValue={selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(value => {
                  const techStack = techStacks.find(tech => tech.id === value);
                  return (
                    <Chip
                      key={value}
                      label={techStack?.name || value}
                      size='small'
                      color='primary'
                      variant='outlined'
                    />
                  );
                })}
              </Box>
            )}
            disabled={loading}
          >
            {techStacks.map(techStack => (
              <MenuItem key={techStack.id} value={techStack.id}>
                {techStack.name}
              </MenuItem>
            ))}
          </Select>
          {errors.techStackIds && (
            <FormHelperText>{errors.techStackIds.message}</FormHelperText>
          )}
          <FormHelperText>
            Select the technologies used in this product (optional)
          </FormHelperText>
        </FormControl>

        {/* Main Image */}
        <RHFFileUpload
          name='image'
          control={control}
          label='Main Product Image'
          helperText='Upload the main product image (max 5MB)'
          accept='image/*'
          maxSize={5}
          preview={true}
          multiple={false}
          disabled={loading}
          required
        />

        {/* Additional Images */}
        <RHFFileUpload
          name='images'
          control={control}
          label='Additional Images'
          helperText='Upload additional product images (max 5MB each, up to 9 images)'
          accept='image/*'
          maxSize={5}
          preview={true}
          multiple={true}
          maxFiles={9}
          disabled={loading}
        />

        <ActionButtonsBase
          onSave={() => {
            handleSubmit(handleSubmitWithValidation)();
          }}
          onCancel={handleClose}
          loading={isSubmitting || loading}
          saveText={isEdit ? 'Update Product' : 'Create Product'}
          cancelText='Cancel'
          justifyContent='flex-end'
          spacing={2}
        />
      </Box>
    </DialogBase>
  );
};

export default DialogForm;
