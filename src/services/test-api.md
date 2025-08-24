# API Testing Guide

## Vấn đề đã được sửa:

### 1. **Infinite Loop trong getProfile**
- **Nguyên nhân**: `useGetProfileQuery()` được gọi liên tục không có điều kiện
- **Giải pháp**: Thêm `skip`, `refetchOnMountOrArgChange: false`, `refetchOnFocus: false`

### 2. **Headers Type Error**
- **Nguyên nhân**: TypeScript không thể xử lý `Headers` constructor với type không rõ ràng
- **Giải pháp**: Thêm try-catch và fallback cho headers

### 3. **401 Redirect Loop**
- **Nguyên nhân**: Redirect về login cho tất cả endpoints, kể cả auth endpoints
- **Giải pháp**: Chỉ redirect cho non-auth endpoints

### 4. **localStorage Conflict**
- **Nguyên nhân**: `authSlice` vẫn sử dụng localStorage cho `isAuthenticated`
- **Giải pháp**: Loại bỏ localStorage, sử dụng `setAuthenticated` action

## Cách test:

### 1. **Kiểm tra Console**
```javascript
// Mở DevTools Console và xem:
// - Có API calls liên tục không?
// - Có errors 401 không?
// - Có redirect loops không?
```

### 2. **Kiểm tra Network Tab**
```javascript
// Trong DevTools Network tab:
// - Xem có requests liên tục đến /auth/profile không?
// - Xem response status codes
// - Xem cookies có được gửi không?
```

### 3. **Test Login Flow**
```javascript
// 1. Mở /login
// 2. Nhập credentials
// 3. Submit form
// 4. Kiểm tra:
//    - Redirect có thành công không?
//    - User state có được set không?
//    - Profile API có được gọi không?
```

### 4. **Test Protected Routes**
```javascript
// 1. Login thành công
// 2. Truy cập /admin hoặc /profile
// 3. Kiểm tra:
//    - Có bị redirect về login không?
//    - Component có render đúng không?
//    - API calls có ổn định không?
```

## Debug Commands:

### Kiểm tra Redux State:
```javascript
// Trong Console:
const state = window.store.getState();
console.log('Auth State:', state.auth);
console.log('User:', state.auth.user);
console.log('isAuthenticated:', state.auth.isAuthenticated);
```

### Kiểm tra Cookies:
```javascript
// Trong Console:
console.log('Cookies:', document.cookie);
```

### Kiểm tra API Calls:
```javascript
// Trong Console:
// Xem RTK Query cache:
const apiState = window.store.getState().authApi;
console.log('Auth API State:', apiState);
```

## Expected Behavior:

### ✅ **Sau khi sửa:**
1. **Login**: Chỉ gọi API 1 lần, set user state, redirect
2. **Profile**: Chỉ gọi khi cần thiết (user authenticated nhưng chưa có data)
3. **Protected Routes**: Không bị redirect loop
4. **401 Errors**: Chỉ redirect cho non-auth endpoints
5. **Cookies**: Tự động được gửi với mọi request

### ❌ **Trước khi sửa:**
1. **Infinite API calls** đến `/auth/profile`
2. **Redirect loops** giữa login và protected routes
3. **Headers type errors** trong console
4. **localStorage conflicts** với cookie auth

## Nếu vẫn có vấn đề:

### 1. **Kiểm tra Backend:**
```bash
# Backend có trả về đúng response format không?
# Cookies có được set đúng không?
# CORS có được config đúng không?
```

### 2. **Kiểm tra Constants:**
```typescript
// API_ROUTES có đúng không?
console.log('API Routes:', API_ROUTES);
```

### 3. **Kiểm tra Store:**
```typescript
// Store có được config đúng không?
// Middleware có được add đúng không?
```

### 4. **Clear Browser Data:**
```bash
# Clear cookies, localStorage, sessionStorage
# Hard refresh (Ctrl+F5)
```

