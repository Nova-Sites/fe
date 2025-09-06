# 🛠️ Hướng dẫn Lint & Format Code

## 📋 Tổng quan

Dự án đã được cấu hình đầy đủ hệ thống lint và format code tự động:

- **ESLint**: Kiểm tra code style, tìm bug tiềm ẩn
- **Prettier**: Format code tự động (dấu cách, xuống dòng, dấu phẩy...)
- **Husky**: Git hooks để chạy lint/format trước khi commit
- **lint-staged**: Chỉ chạy lint/format cho file thay đổi

## 🚀 Scripts có sẵn

```bash
# Lint code (kiểm tra lỗi)
npm run lint

# Lint và tự sửa lỗi có thể sửa được
npm run lint:fix

# Format toàn bộ code
npm run format

# Kiểm tra format (không sửa)
npm run format:check

# Kiểm tra TypeScript types
npm run type-check
```

## 🔄 Git Hooks

### Pre-commit Hook

Khi bạn chạy `git commit`, hệ thống sẽ:

1. Chạy ESLint trên các file thay đổi
2. Tự động format code với Prettier
3. Nếu có lỗi không sửa được → commit sẽ bị hủy

### Pre-push Hook

Khi bạn chạy `git push`, hệ thống sẽ:

1. Kiểm tra TypeScript types
2. Nếu có lỗi type → push sẽ bị hủy

## 📝 Quy trình làm việc

### 1. Trước khi commit

```bash
# Tự động format code
npm run format

# Kiểm tra lỗi
npm run lint

# Sửa lỗi có thể sửa được
npm run lint:fix
```

### 2. Commit code

```bash
git add .
git commit -m "feat: add new feature"
# Hệ thống sẽ tự động chạy lint-staged
```

### 3. Push code

```bash
git push origin main
# Hệ thống sẽ kiểm tra TypeScript types
```

## ⚙️ Cấu hình

### ESLint Rules

- Sử dụng TypeScript strict mode
- Không cho phép `any` type
- Kiểm tra React hooks dependencies
- Tương thích với Prettier

### Prettier Rules

- Single quotes cho strings
- Semicolons bắt buộc
- 2 spaces indentation
- 80 characters line width
- Trailing commas cho ES5

### Files được ignore

- `node_modules/`
- `dist/`
- `build/`
- `*.min.js`
- `*.min.css`

## 🐛 Xử lý lỗi thường gặp

### 1. ESLint lỗi `@typescript-eslint/no-explicit-any`

```typescript
// ❌ Không được
const data: any = response.data;

// ✅ Đúng
const data: UserData = response.data;
// hoặc
const data = response.data as UserData;
```

### 2. React Hooks missing dependencies

```typescript
// ❌ Không được
useEffect(() => {
  fetchData(userId);
}, []);

// ✅ Đúng
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### 3. Prettier format conflicts

```typescript
// Prettier sẽ tự động format, không cần lo lắng
// Chỉ cần chạy: npm run format
```

## 🔧 Tùy chỉnh

### Thay đổi ESLint rules

Chỉnh sửa file `eslint.config.js`:

```javascript
rules: {
  'prettier/prettier': 'error',
  '@typescript-eslint/no-explicit-any': 'warn', // Thay vì 'error'
  // ... other rules
}
```

### Thay đổi Prettier rules

Chỉnh sửa file `.prettierrc`:

```json
{
  "singleQuote": false, // Sử dụng double quotes
  "printWidth": 100, // Tăng line width
  "tabWidth": 4 // Tăng indentation
}
```

### Thay đổi lint-staged

Chỉnh sửa trong `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## 📚 Tài liệu tham khảo

- [ESLint Documentation](https://eslint.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)

## 🎯 Lợi ích

1. **Code consistency**: Tất cả dev viết code theo cùng 1 style
2. **Bug prevention**: Phát hiện lỗi sớm trước khi commit
3. **Auto-formatting**: Không cần format thủ công
4. **Type safety**: Đảm bảo TypeScript types đúng
5. **Team productivity**: Giảm thời gian review code
