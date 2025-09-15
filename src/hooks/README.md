# Custom Hooks Documentation

This directory contains custom React hooks that centralize API logic and provide a consistent interface for data management across the application.

## Available Hooks

### useAuth

Centralized authentication logic with Redux integration.

```typescript
import { useAuth } from '@/hooks';

const {
  user,
  isAuthenticated,
  isLoading,
  error,
  login,
  register,
  logout,
  verifyOTP,
  resendOTP,
  isAdmin,
  isSuperAdmin,
} = useAuth();
```

### useCategories

Category management with CRUD operations.

```typescript
import { useCategories, useCategory } from '@/hooks';

// For category list management
const {
  categories,
  isLoading,
  error,
  createCategory,
  updateCategory,
  deleteCategory,
  refetchCategories,
  isCreating,
  isUpdating,
  isDeleting,
} = useCategories();

// For single category by slug
const { category, isLoading, error, refetch } = useCategory('category-slug');
```

**Example Usage:**

```typescript
const AdminCategoriesPage = () => {
  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    refetchCategories
  } = useCategories();

  const handleCreate = async (data: CategoryCreateInput) => {
    const result = await createCategory(data);
    if (result.success) {
      await refetchCategories();
      // Show success message
    } else {
      // Show error message
      console.error(result.error);
    }
  };

  return (
    <div>
      {isLoading && <LoadingBase />}
      {/* Render categories */}
    </div>
  );
};
```

### useProducts

Product management with filtering and pagination.

```typescript
import { useProducts, useProduct, usePopularProducts } from '@/hooks';

// For product list with filters
const {
  products,
  pagination,
  isLoading,
  error,
  createProduct,
  updateProduct,
  deleteProduct,
  refetchProducts,
  isCreating,
  isUpdating,
  isDeleting,
} = useProducts({
  categoryId: 1,
  page: 1,
  limit: 10,
  search: 'keyword',
});

// For single product by slug
const { product, isLoading, error, refetch } = useProduct('product-slug');

// For popular products
const { popularProducts, isLoading, error, refetch } = usePopularProducts();
```

**Example Usage:**

```typescript
const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    search: ''
  });

  const {
    products,
    pagination,
    isLoading,
    createProduct
  } = useProducts(filters);

  const handleCreate = async (data: ProductCreateInput) => {
    const result = await createProduct(data);
    if (result.success) {
      // Show success message
    } else {
      // Show error message
      console.error(result.error);
    }
  };

  return (
    <div>
      {isLoading && <LoadingBase />}
      <ProductGrid products={products} />
      <Pagination
        page={pagination?.page || 1}
        totalPages={pagination?.totalPages || 1}
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
      />
    </div>
  );
};
```

### useUsers

User management for admin operations.

```typescript
import { useUsers } from '@/hooks';

const {
  users,
  isLoading,
  error,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserRole,
  refetchUsers,
  isUpdating,
  isDeleting,
} = useUsers();
```

**Example Usage:**

```typescript
const AdminUsersPage = () => {
  const {
    users,
    isLoading,
    updateUser,
    toggleUserStatus,
    refetchUsers
  } = useUsers();

  const handleToggleStatus = async (userId: number, isActive: boolean) => {
    const result = await toggleUserStatus(userId, isActive);
    if (result.success) {
      await refetchUsers();
      // Show success message
    } else {
      // Show error message
      console.error(result.error);
    }
  };

  return (
    <div>
      {isLoading && <LoadingBase />}
      {/* Render users table */}
    </div>
  );
};
```

## FormData Handling

All hooks automatically handle FormData conversion for file uploads:

### Categories

```typescript
const { createCategory } = useCategories();

// Automatically converts to FormData when image is a File
const result = await createCategory({
  name: 'Electronics',
  slug: 'electronics',
  description: 'Electronic products',
  image: file, // File object
});
```

### Products

```typescript
const { createProduct } = useProducts();

// Automatically converts to FormData when images contain Files
const result = await createProduct({
  name: 'iPhone 15',
  slug: 'iphone-15',
  description: 'Latest iPhone',
  price: 999,
  categoryId: 1,
  images: [file1, file2], // Array of File objects
  isActive: true,
});
```

### Users

```typescript
const { updateUser } = useUsers();

// Automatically detects if FormData is needed
const result = await updateUser(userId, {
  username: 'john_doe',
  email: 'john@example.com',
  image: file, // File object - will use FormData
});

// Or regular JSON for non-file updates
const result2 = await updateUser(userId, {
  username: 'john_doe',
  isActive: false, // No file - will use JSON
});
```

## Benefits

### 1. **Centralized Logic**

- All API calls are centralized in custom hooks
- Consistent error handling across components
- Easy to maintain and update
- Automatic FormData conversion for file uploads

### 2. **Type Safety**

- Full TypeScript support with proper typing
- Auto-completion and type checking
- Prevents runtime errors

### 3. **Consistent Interface**

- All hooks follow the same pattern
- Standardized return values and error handling
- Easy to learn and use

### 4. **Performance Optimization**

- Built-in caching with RTK Query
- Automatic refetching and invalidation
- Optimistic updates where applicable

### 5. **File Upload Support**

- Automatic FormData conversion for file uploads
- Smart detection of when to use FormData vs JSON
- Support for single files (categories, users) and multiple files (products)

### 6. **Loading States**

- Individual loading states for each operation
- Combined loading states for better UX
- Easy to show loading indicators

## Error Handling

All hooks return a consistent error structure:

```typescript
interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

**Example:**

```typescript
const result = await createCategory(data);

if (result.success) {
  // Handle success
  console.log('Created:', result.data);
} else {
  // Handle error
  console.error('Error:', result.error);
}
```

## Best Practices

### 1. **Always Check Success**

```typescript
// ✅ Good
const result = await createCategory(data);
if (result.success) {
  // Handle success
} else {
  // Handle error
}

// ❌ Bad
const result = await createCategory(data);
// Missing error handling
```

### 2. **Use Loading States**

```typescript
// ✅ Good
const { isLoading, createCategory } = useCategories();

if (isLoading) {
  return <LoadingBase />;
}

// ❌ Bad
// No loading state handling
```

### 3. **Refetch After Mutations**

```typescript
// ✅ Good
const result = await createCategory(data);
if (result.success) {
  await refetchCategories();
}

// ❌ Bad
// Data not refreshed after creation
```

### 4. **Handle Errors Gracefully**

```typescript
// ✅ Good
const result = await updateCategory(id, data);
if (!result.success) {
  setError(result.error || 'Failed to update category');
}

// ❌ Bad
// Silent failure
```

## Migration Guide

### Before (Direct API calls)

```typescript
// Old way
const [createCategoryMutation] = useCreateCategoryMutation();

const handleSubmit = async data => {
  try {
    const result = await createCategoryMutation(data).unwrap();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### After (Using hooks)

```typescript
// New way
const { createCategory } = useCategories();

const handleSubmit = async data => {
  const result = await createCategory(data);
  if (result.success) {
    // Handle success
  } else {
    // Handle error
  }
};
```

## Future Enhancements

- [ ] Add optimistic updates
- [ ] Implement offline support
- [ ] Add retry mechanisms
- [ ] Include more granular loading states
- [ ] Add batch operations
