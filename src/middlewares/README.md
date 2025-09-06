# Frontend Middlewares

Hệ thống middlewares được thiết kế để xử lý routing, authentication, authorization và validation trong React application.

## 📁 Cấu trúc

```
src/middlewares/
├── index.ts              # Export tất cả middlewares
├── RouteGuard.tsx        # Middleware chính xử lý routing
├── AuthGuard.tsx         # Middleware xác thực
├── RoleGuard.tsx         # Middleware kiểm tra quyền
├── LoadingGuard.tsx      # Middleware xử lý loading state
├── ErrorBoundary.tsx     # Middleware xử lý lỗi React
├── ValidationGuard.tsx   # Middleware validation
├── middleware.utils.ts   # Utility functions cho middlewares
└── route.utils.ts        # Utility functions cho route handling
```

## 🚀 Cách sử dụng

### 1. RouteGuard - Middleware chính

```tsx
import { RouteGuard } from '@/middlewares';

// Sử dụng với route hiện tại
<RouteGuard>
  <ProtectedComponent />
</RouteGuard>

// Sử dụng với route cụ thể
<RouteGuard routePath="/admin/users">
  <AdminUsersComponent />
</RouteGuard>

// Sử dụng với fallback
<RouteGuard fallback={<AccessDenied />}>
  <ProtectedComponent />
</RouteGuard>
```

### 2. AuthGuard - Xác thực

```tsx
import { AuthGuard } from '@/middlewares';

// Yêu cầu authentication
<AuthGuard requireAuth={true}>
  <ProfilePage />
</AuthGuard>

// Không yêu cầu authentication (cho login/register)
<AuthGuard requireAuth={false}>
  <LoginPage />
</AuthGuard>

// Custom redirect
<AuthGuard redirectTo="/custom-login">
  <ProtectedComponent />
</AuthGuard>
```

### 3. RoleGuard - Kiểm tra quyền

```tsx
import { RoleGuard } from '@/middlewares';

// Kiểm tra một role
<RoleGuard requiredRoles={['ROLE_ADMIN']}>
  <AdminDashboard />
</RoleGuard>

// Kiểm tra nhiều roles
<RoleGuard requiredRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
  <AdminComponent />
</RoleGuard>

// Custom fallback
<RoleGuard
  requiredRoles={['ROLE_SUPER_ADMIN']}
  fallback={<InsufficientPermissions />}
>
  <SuperAdminComponent />
</RoleGuard>
```

### 4. LoadingGuard - Xử lý loading

```tsx
import { LoadingGuard } from '@/middlewares';

<LoadingGuard isLoading={isLoading}>
  <DataComponent />
</LoadingGuard>

// Custom loading time và fallback
<LoadingGuard
  isLoading={isLoading}
  minLoadingTime={500}
  fallback={<CustomSpinner />}
>
  <DataComponent />
</LoadingGuard>
```

### 5. ErrorBoundary - Xử lý lỗi

```tsx
import { ErrorBoundary } from '@/middlewares';

<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>

// Custom error handling
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Custom error handling:', error);
    // Gửi error đến logging service
  }}
  fallback={<CustomErrorPage />}
>
  <ComponentThatMightError />
</ErrorBoundary>
```

### 6. ValidationGuard - Validation

```tsx
import { ValidationGuard, createValidationRules } from '@/middlewares';

const validationRules = [
  createValidationRules.email(),
  createValidationRules.password(8),
  createValidationRules.required('name'),
  createValidationRules.minLength('description', 10),
];

<ValidationGuard
  data={formData}
  rules={validationRules}
  onValidationError={errors => setErrors(errors)}
  showErrors={true}
>
  <FormComponent />
</ValidationGuard>;
```

## 🔧 Route Configuration

### Cấu hình route mặc định

```typescript
import { registerRoute, RouteConfig } from '@/middlewares';

// Đăng ký route mới
const newRoute: RouteConfig = {
  path: '/admin/settings',
  type: 'admin',
  requireAuth: true,
  requiredRoles: ['ROLE_ADMIN'],
  redirectTo: '/login',
};

registerRoute(newRoute);
```

### Tạo route guard tùy chỉnh

```typescript
import { createRouteGuard } from '@/middlewares';

const customRouteGuard = createRouteGuard([
  {
    path: '/custom-route',
    type: 'user',
    requireAuth: true,
    redirectTo: '/custom-login',
  },
]);

// Sử dụng
const routeConfig = customRouteGuard.getRouteConfig('/custom-route');
const canAccess = customRouteGuard.canUserAccessRoute(
  '/custom-route',
  user,
  isAuthenticated
);
```

## 🎯 Validation Rules

### Tạo validation rules

```typescript
import { createValidationRules } from '@/middlewares';

const rules = [
  // Email validation
  createValidationRules.email(),

  // Password validation
  createValidationRules.password(10),

  // Phone validation
  createValidationRules.phone(),

  // URL validation
  createValidationRules.url(),

  // Required field
  createValidationRules.required('username'),

  // Length validation
  createValidationRules.minLength('description', 20),
  createValidationRules.maxLength('title', 100),

  // Pattern validation
  createValidationRules.pattern(
    'slug',
    /^[a-z0-9-]+$/,
    'Slug must contain only lowercase letters, numbers, and hyphens'
  ),
];
```

### Custom validation

```typescript
const customRule = {
  field: 'age',
  required: true,
  custom: (value: any) => value >= 18,
  message: 'User must be at least 18 years old',
};
```

## 🔄 Middleware Chain

### Tạo middleware chain

```typescript
import { createMiddlewareChain } from '@/middlewares';

const middlewareChain = createMiddlewareChain(
  async context => {
    // Middleware 1: Check authentication
    if (!context.isAuthenticated) return false;
    return true;
  },
  async context => {
    // Middleware 2: Check permissions
    if (!context.user.hasPermission('read')) return false;
    return true;
  },
  async context => {
    // Middleware 3: Validate data
    if (!context.data.isValid) return false;
    return true;
  }
);

// Sử dụng
const result = await middlewareChain(context);
if (result.success) {
  // Tất cả middlewares passed
  console.log('Access granted');
} else {
  // Có middleware failed
  console.log('Access denied:', result.errors);
}
```

## 📱 Integration với App

### Sử dụng trong App.tsx

```tsx
import { ErrorBoundary } from '@/middlewares';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Routes được bảo vệ bởi RouteGuard */}
          <Route
            path='/admin'
            element={
              <RouteGuard>
                <AdminDashboard />
              </RouteGuard>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

### Sử dụng trong components

```tsx
import { AuthGuard, RoleGuard, LoadingGuard } from '@/middlewares';

function AdminPage() {
  const { data, isLoading } = useQuery();

  return (
    <AuthGuard>
      <RoleGuard requiredRoles={['ROLE_ADMIN']}>
        <LoadingGuard isLoading={isLoading}>
          <AdminContent data={data} />
        </LoadingGuard>
      </RoleGuard>
    </AuthGuard>
  );
}
```

## 🎨 Customization

### Custom fallback components

```tsx
const CustomAccessDenied = () => (
  <div className='access-denied'>
    <h2>Access Denied</h2>
    <p>You don't have permission to access this page.</p>
  </div>
);

<RoleGuard requiredRoles={['ROLE_ADMIN']} fallback={<CustomAccessDenied />}>
  <AdminComponent />
</RoleGuard>;
```

### Custom error handling

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log error
    console.error('Error occurred:', error);

    // Send to monitoring service
    monitoringService.captureException(error);

    // Show user-friendly message
    toast.error('Something went wrong. Please try again.');
  }}
>
  <Component />
</ErrorBoundary>
```

## 🔒 Security Features

- **Authentication**: Kiểm tra user đã đăng nhập
- **Authorization**: Kiểm tra quyền truy cập dựa trên role
- **Route Protection**: Bảo vệ routes theo cấu hình
- **Input Validation**: Validate dữ liệu đầu vào
- **Error Handling**: Xử lý lỗi an toàn
- **Loading States**: Quản lý trạng thái loading

## 📚 Best Practices

1. **Wrap critical components** với ErrorBoundary
2. **Sử dụng RouteGuard** cho tất cả protected routes
3. **Validate input data** trước khi xử lý
4. **Handle loading states** để UX tốt hơn
5. **Customize fallbacks** cho user experience tốt hơn
6. **Log errors** để debugging
7. **Test middlewares** với different user roles
