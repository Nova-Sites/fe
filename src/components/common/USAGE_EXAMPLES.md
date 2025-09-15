# Common Components Usage Examples

## Form Components

### 1. FormBase Component

```tsx
import {
  FormBase,
  FormFieldBase,
  Input,
  SelectBase,
  TextAreaBase,
  ActionButtonsBase,
} from '@/components/common';

const CreateProductForm = () => {
  const handleSubmit = (data: any) => {
    console.log('Form data:', data);
    // Handle form submission
  };

  return (
    <FormBase onSubmit={handleSubmit} padding='lg'>
      <FormFieldBase label='Product Name' required>
        <Input name='name' placeholder='Enter product name' required />
      </FormFieldBase>

      <FormFieldBase label='Category' required>
        <SelectBase
          name='category'
          options={[
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'books', label: 'Books' },
          ]}
          placeholder='Select category'
          onChange={value => console.log('Selected:', value)}
        />
      </FormFieldBase>

      <FormFieldBase label='Description'>
        <TextAreaBase
          name='description'
          placeholder='Enter product description'
          rows={4}
        />
      </FormFieldBase>

      <ActionButtonsBase
        onSave={() => console.log('Save')}
        onCancel={() => console.log('Cancel')}
        saveText='Create Product'
        cancelText='Cancel'
      />
    </FormBase>
  );
};
```

### 2. FileUploadBase Component

```tsx
import { FileUploadBase } from '@/components/common';

const ImageUploadExample = () => {
  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
    // Handle file upload
  };

  return (
    <FileUploadBase
      onFileSelect={handleFileSelect}
      accept='image/*'
      maxSize={5}
      preview={true}
      label='Product Images'
      helperText='Upload product images (max 5MB each)'
    />
  );
};
```

### 3. Dialog with Form

```tsx
import {
  Dialog,
  FormBase,
  FormFieldBase,
  Input,
  ActionButtonsBase,
} from '@/components/common';

const EditCategoryDialog = ({ open, onClose, category }) => {
  const handleSubmit = (data: any) => {
    console.log('Update category:', data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title='Edit Category' maxWidth='sm'>
      <FormBase onSubmit={handleSubmit}>
        <FormFieldBase label='Category Name' required>
          <Input
            name='name'
            defaultValue={category?.name}
            placeholder='Enter category name'
            required
          />
        </FormFieldBase>

        <ActionButtonsBase
          onSave={() => console.log('Save')}
          onCancel={onClose}
          saveText='Update'
          cancelText='Cancel'
        />
      </FormBase>
    </Dialog>
  );
};
```

### 4. Complete CRUD Form Example

```tsx
import React, { useState } from 'react';
import {
  FormBase,
  FormFieldBase,
  Input,
  SelectBase,
  TextAreaBase,
  FileUploadBase,
  ActionButtonsBase,
  Alert,
  Card,
} from '@/components/common';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      await onSave(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    // Handle file upload logic
    console.log('File selected:', file);
  };

  return (
    <Card padding='lg'>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FormBase onSubmit={handleSubmit} loading={loading}>
        <FormFieldBase label='Product Name' required>
          <Input
            name='name'
            defaultValue={product?.name}
            placeholder='Enter product name'
            required
          />
        </FormFieldBase>

        <FormFieldBase label='Category' required>
          <SelectBase
            name='category'
            value={product?.category || ''}
            options={[
              { value: 'electronics', label: 'Electronics' },
              { value: 'clothing', label: 'Clothing' },
              { value: 'books', label: 'Books' },
            ]}
            placeholder='Select category'
            onChange={value => console.log('Category:', value)}
          />
        </FormFieldBase>

        <FormFieldBase label='Price' required>
          <Input
            name='price'
            type='number'
            defaultValue={product?.price}
            placeholder='Enter price'
            required
          />
        </FormFieldBase>

        <FormFieldBase label='Description'>
          <TextAreaBase
            name='description'
            defaultValue={product?.description}
            placeholder='Enter product description'
            rows={4}
          />
        </FormFieldBase>

        <FormFieldBase label='Product Images'>
          <FileUploadBase
            onFileSelect={handleFileSelect}
            accept='image/*'
            maxSize={5}
            preview={true}
            multiple={true}
            maxFiles={5}
            helperText='Upload up to 5 images (max 5MB each)'
          />
        </FormFieldBase>

        <ActionButtonsBase
          onSave={() => console.log('Save')}
          onCancel={onCancel}
          loading={loading}
          saveText={product ? 'Update Product' : 'Create Product'}
          cancelText='Cancel'
          justifyContent='flex-end'
        />
      </FormBase>
    </Card>
  );
};
```

## Component Features

### FormBase Component

- ✅ Automatic form data collection
- ✅ Loading state support
- ✅ Paper wrapper with elevation
- ✅ Configurable padding

### SelectBase Component

- ✅ Dropdown selection
- ✅ Placeholder support
- ✅ Error handling
- ✅ Disabled state
- ✅ Required field support

### FileUploadBase Component

- ✅ Drag & drop support
- ✅ File type validation
- ✅ File size validation
- ✅ Preview functionality
- ✅ Multiple file support
- ✅ File removal

### FormFieldBase Component

- ✅ Label with required indicator
- ✅ Error message display
- ✅ Helper text support
- ✅ Consistent styling

### ActionButtonsBase Component

- ✅ Save/Cancel buttons
- ✅ Loading state
- ✅ Customizable text
- ✅ Flexible layout options

### TextAreaBase Component

- ✅ Multi-line text input
- ✅ Configurable rows
- ✅ Icon support
- ✅ Error handling
