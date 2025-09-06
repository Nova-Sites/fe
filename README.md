# Frontend Application

## Cấu trúc dự án

### 📁 Thư mục chính

```
src/
├── components/          # React components
├── constants/           # Constants và configuration
├── hooks/              # Custom React hooks
├── middlewares/        # Frontend guards và utilities
├── pages/              # Page components
├── routes/             # Route configurations
├── services/           # API services
├── store/              # Redux store
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### 🛡️ Middlewares (Frontend Guards)

Các middlewares được thiết kế để bảo vệ routes và xử lý logic:

- **AuthGuard**: Kiểm tra authentication
- **RoleGuard**: Kiểm tra quyền truy cập
- **ValidationGuard**: Validate form data
- **ErrorBoundary**: Xử lý lỗi React
- **LoadingGuard**: Quản lý loading state

### 🛠️ Utilities

Các utility functions được tổ chức theo chức năng:

#### Validation Utils

- `isValidEmail()` - Kiểm tra email hợp lệ
- `isValidPassword()` - Kiểm tra password mạnh
- `isValidPhone()` - Kiểm tra số điện thoại
- `isValidUrl()` - Kiểm tra URL hợp lệ
- `isValidSlug()` - Kiểm tra slug hợp lệ

#### String Utils

- `toTitleCase()` - Chuyển đổi thành title case
- `toSlug()` - Tạo slug từ string
- `toCamelCase()` - Chuyển đổi thành camelCase
- `truncate()` - Cắt string với ellipsis
- `capitalize()` - Viết hoa chữ cái đầu

#### Date Utils

- `formatDate()` - Format date theo pattern
- `getRelativeTime()` - Thời gian tương đối (2 hours ago)
- `isToday()`, `isYesterday()` - Kiểm tra ngày
- `addDays()`, `subtractDays()` - Thêm/bớt ngày

#### File Utils

- `getFileExtension()` - Lấy extension của file
- `formatFileSize()` - Format kích thước file
- `isImageFile()`, `isVideoFile()` - Kiểm tra loại file
- `generateUniqueFilename()` - Tạo tên file unique
- `validateFileUpload()` - Validate file upload

#### Crypto Utils

- `generateSecureToken()` - Tạo token bảo mật
- `generateUUID()` - Tạo UUID v4
- `hashPassword()` - Hash password
- `encryptText()`, `decryptText()` - Mã hóa/giải mã

#### Response Utils

- `successResponse()` - Tạo response thành công
- `errorResponse()` - Tạo response lỗi
- `paginatedResponse()` - Tạo response có pagination
- `validationErrorResponse()` - Tạo response validation error

#### Pagination Utils

- `calculatePagination()` - Tính toán thông tin pagination
- `validatePagination()` - Validate pagination params
- `getPaginationLinks()` - Tạo links pagination
- `paginateArray()` - Phân trang array

#### Sanitize Utils

- `sanitizeHtml()` - Làm sạch HTML
- `sanitizeText()` - Làm sạch text
- `removeXSS()` - Loại bỏ XSS attempts
- `removeSQLInjection()` - Loại bỏ SQL injection

### 🚦 Routes

Routes được tổ chức theo nhóm logic:

#### Public Routes

- `/` - Home page

#### Auth Routes

- `/login` - Login page
- `/register` - Register page

#### User Routes

- `/profile` - User profile
- `/products` - Products list
- `/products/:slug` - Product detail
- `/categories` - Categories list

#### Admin Routes

- `/admin` - Admin dashboard

### 🔐 Authentication

Hệ thống authentication sử dụng:

- Redux store để quản lý state
- RTK Query để gọi API
- Cookies để lưu trữ tokens
- Protected routes với role-based access control

### 📱 Features

- **Lazy Loading**: Components được load theo nhu cầu
- **Type Safety**: TypeScript cho type safety
- **State Management**: Redux Toolkit + RTK Query
- **Responsive Design**: Tailwind CSS
- **Form Validation**: Custom validation logic
- **Error Handling**: Error boundaries và error states
- **Loading States**: Loading guards và spinners

### 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### 📦 Dependencies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### 🔧 Configuration

- **Vite**: Build tool configuration
- **TypeScript**: Compiler options
- **ESLint**: Code linting rules
- **Tailwind**: CSS framework configuration
