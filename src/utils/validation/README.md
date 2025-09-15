# Validation System với React Hook Form + Zod

## Overview

Hệ thống validation hiện đại sử dụng React Hook Form (RHF) + Zod cho hiệu năng cao và TypeScript support tốt.

## Features

- ✅ **High Performance**: Không re-render toàn form khi thay đổi input
- ✅ **TypeScript First**: Type inference tự động từ Zod schemas
- ✅ **Easy API**: API đơn giản hơn Formik
- ✅ **MUI Integration**: Controller sẵn có cho MUI components
- ✅ **Centralized Validation**: Tất cả validation rules ở một nơi
- ✅ **Reusable Schemas**: Schemas có thể tái sử dụng

## Cấu trúc

```
src/utils/validation/
├── schemas.ts          # Tất cả validation schemas
└── README.md          # Documentation

src/components/common/forms/
├── RHFFormBase.tsx    # Form wrapper với RHF
├── RHFInput.tsx       # Input component với RHF
├── RHFSelect.tsx      # Select component với RHF
├── RHFTextArea.tsx    # TextArea component với RHF
├── RHFFileUpload.tsx  # FileUpload component với RHF
└── index.ts           # Exports
```

## Usage

### 1. Basic Form với RHF

```tsx
import { RHFFormBase, RHFInput, RHFTextArea } from '@/components/common';
import {
  categorySchemas,
  CategoryCreateInput,
} from '@/utils/validation/schemas';

const MyForm = () => {
  const handleSubmit = async (data: CategoryCreateInput) => {
    console.log('Form data:', data);
    // Handle submission
  };

  return (
    <RHFFormBase
      onSubmit={handleSubmit}
      schema={categorySchemas.create}
      defaultValues={{
        name: '',
        description: '',
        slug: '',
        image: '',
      }}
    >
      <RHFInput
        name='name'
        control={control}
        label='Category Name'
        placeholder='Enter category name'
        required
      />

      <RHFTextArea
        name='description'
        control={control}
        label='Description'
        rows={4}
        required
      />
    </RHFFormBase>
  );
};
```

### 2. Advanced Form với Custom Control

```tsx
import { useRHFForm, RHFInput } from '@/components/common';
import {
  categorySchemas,
  CategoryCreateInput,
} from '@/utils/validation/schemas';

const AdvancedForm = () => {
  const form = useRHFForm<CategoryCreateInput>({
    resolver: zodResolver(categorySchemas.create),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      image: '',
    },
    mode: 'onChange',
  });

  const { control, watch, setValue, handleSubmit } = form;

  // Auto-generate slug from name
  const nameValue = watch('name');
  React.useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [nameValue, setValue]);

  const onSubmit = async (data: CategoryCreateInput) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RHFInput name='name' control={control} label='Category Name' required />

      <RHFInput name='slug' control={control} label='Slug' required />
    </form>
  );
};
```

## Validation Schemas

### Category Schema

```typescript
export const categorySchemas = {
  create: z.object({
    name: baseSchemas.requiredString(2, 100),
    slug: baseSchemas.slug,
    description: baseSchemas.requiredString(10, 1000),
    image: baseSchemas.file(5, ['image/*']),
  }),

  update: z.object({
    name: baseSchemas.requiredString(2, 100),
    slug: baseSchemas.slug,
    description: baseSchemas.requiredString(10, 1000),
    image: baseSchemas.file(5, ['image/*']).optional(),
  }),
};
```

### Product Schema

```typescript
export const productSchemas = {
  create: z.object({
    name: baseSchemas.requiredString(2, 200),
    slug: baseSchemas.slug,
    description: baseSchemas.requiredString(10, 2000),
    price: z.number().min(0).max(999999),
    categoryId: z.number().min(1),
    images: z
      .array(baseSchemas.file(5, ['image/*']))
      .min(1)
      .max(10),
    isActive: z.boolean().default(true),
  }),
};
```

## Base Schemas

### String Validation

```typescript
// Required string with min/max length
baseSchemas.requiredString(2, 100);

// Optional string with max length
baseSchemas.optionalString(255);

// Email validation
baseSchemas.email;

// Phone validation
baseSchemas.phone;

// URL validation
baseSchemas.url;

// Slug validation
baseSchemas.slug;
```

### File Validation

```typescript
// Single file with size and type limits
baseSchemas.file(5, ['image/*']);

// Multiple files
z.array(baseSchemas.file(5, ['image/*']))
  .min(1)
  .max(10);
```

## RHF Components

### RHFInput

```tsx
<RHFInput
  name='fieldName'
  control={control}
  label='Field Label'
  placeholder='Placeholder text'
  helperText='Helper text'
  required
  disabled={loading}
/>
```

### RHFSelect

```tsx
<RHFSelect
  name='categoryId'
  control={control}
  label='Category'
  options={[
    { value: 1, label: 'Electronics' },
    { value: 2, label: 'Clothing' },
  ]}
  placeholder='Select category'
  required
/>
```

### RHFTextArea

```tsx
<RHFTextArea
  name='description'
  control={control}
  label='Description'
  rows={4}
  placeholder='Enter description'
  required
/>
```

### RHFFileUpload

```tsx
<RHFFileUpload
  name='image'
  control={control}
  label='Image'
  accept='image/*'
  maxSize={5}
  preview={true}
  multiple={false}
  required
/>
```

## Best Practices

### 1. Schema Organization

- Tách riêng schemas cho từng entity
- Sử dụng base schemas để tái sử dụng
- Đặt tên rõ ràng: `entitySchemas.create`, `entitySchemas.update`

### 2. Form Components

- Luôn sử dụng RHF components thay vì MUI trực tiếp
- Truyền `control` prop cho mọi RHF component
- Sử dụng `useRHFForm` hook cho advanced cases

### 3. Validation Rules

- Đặt validation rules trong schemas, không trong components
- Sử dụng custom error messages rõ ràng
- Test validation rules với unit tests

### 4. Performance

- Sử dụng `mode: 'onChange'` cho real-time validation
- Tránh re-render không cần thiết
- Sử dụng `watch` và `setValue` cho dependent fields

## Migration từ Formik

### Before (Formik)

```tsx
<Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ values, errors, touched, handleChange, handleBlur }) => (
    <Form>
      <Field
        name='name'
        component={TextField}
        error={touched.name && Boolean(errors.name)}
        helperText={touched.name && errors.name}
      />
    </Form>
  )}
</Formik>
```

### After (RHF + Zod)

```tsx
<RHFFormBase
  onSubmit={handleSubmit}
  schema={validationSchema}
  defaultValues={initialValues}
>
  <RHFInput name='name' control={control} label='Name' required />
</RHFFormBase>
```

## Type Safety

```typescript
// Types được tự động infer từ Zod schemas
type CategoryCreateInput = z.infer<typeof categorySchemas.create>;
type ProductUpdateInput = z.infer<typeof productSchemas.update>;

// Sử dụng trong components
const handleSubmit = (data: CategoryCreateInput) => {
  // data có type safety hoàn toàn
  console.log(data.name); // ✅ TypeScript biết đây là string
  console.log(data.price); // ❌ TypeScript error vì không có trong CategoryCreateInput
};
```

## Error Handling

```typescript
// Global error handling
const form = useRHFForm({
  resolver: zodResolver(schema),
  defaultValues,
  mode: 'onChange',
});

const {
  formState: { errors, isSubmitting },
} = form;

// Field-specific errors
console.log(errors.name?.message); // Error message cho field name
console.log(errors.email?.type); // Error type (required, pattern, etc.)
```
