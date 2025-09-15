# RHF Form Validation Guide

## 🎯 Validation Behavior

### **1. Focus/Unfocus Validation (onBlur)**

- **Khi user click vào field** → Không hiện error
- **Khi user unfocus (click ra ngoài) mà field trống** → Hiện error ngay lập tức
- **Khi user unfocus mà field có giá trị** → Validate và hiện error nếu không hợp lệ

### **2. Real-time Validation (onChange)**

- **Sau khi field đã được touched** → Validate mỗi khi user thay đổi giá trị
- **Error sẽ biến mất** ngay khi user sửa đúng

### **3. Submit Validation**

- **Khi bấm Submit** → Validate tất cả fields
- **Nếu có lỗi** → Hiện error message và không submit
- **Nếu không có lỗi** → Submit form

## 🔧 Configuration

### **RHFFormBase Settings:**

```typescript
const form = useForm<T>({
  mode: 'onBlur', // Validate khi user unfocus field
  reValidateMode: 'onChange', // Re-validate khi user thay đổi (sau khi đã touched)
  resolver: zodResolver(schema), // Zod validation schema
});
```

### **RHF Components Settings:**

```typescript
// Mỗi RHF component sẽ hiện error khi:
error={isTouched && error?.message ? error.message : undefined}
```

## 📝 Validation Flow

### **Scenario 1: User mới mở form**

1. User mở form → Không có error nào hiện
2. User click vào field → Vẫn không có error
3. User click ra ngoài mà không điền gì → **Hiện error ngay lập tức**
4. User click lại vào field và điền giá trị → Error biến mất

### **Scenario 2: User điền form**

1. User click vào field → Không có error
2. User điền giá trị → Validate real-time, error biến mất nếu đúng
3. User unfocus → Validate một lần nữa

### **Scenario 3: User submit form**

1. User bấm Submit → Validate tất cả fields
2. Nếu có lỗi → Hiện error message "Please fix the validation errors before submitting"
3. Nếu không có lỗi → Submit form

## 🎨 Error Display Logic

```typescript
// Chỉ hiện error khi:
// 1. Field đã được touched (user đã click vào và unfocus)
// 2. Có validation error
error={isTouched && error?.message ? error.message : undefined}
```

## 🚀 Benefits

### **User Experience:**

- ✅ Không spam error khi user chưa bắt đầu điền
- ✅ Error hiện ngay khi user unfocus field trống
- ✅ Error biến mất ngay khi user sửa đúng
- ✅ Submit validation đảm bảo form hợp lệ

### **Developer Experience:**

- ✅ Validation tự động với Zod schemas
- ✅ Type-safe với TypeScript
- ✅ Consistent behavior across all form fields
- ✅ Easy to customize validation rules

## 🔍 Debug Validation

### **Check Form State:**

```typescript
const { formState } = form;
console.log('Form errors:', formState.errors);
console.log('Form touched:', formState.touchedFields);
console.log('Form dirty:', formState.dirtyFields);
console.log('Form valid:', formState.isValid);
```

### **Manual Validation:**

```typescript
// Validate specific field
await form.trigger('fieldName');

// Validate all fields
await form.trigger();
```

## 📋 Example Usage

```tsx
const MyForm = () => {
  const form = useRHFForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: { name: '', email: '' },
  });

  const { control } = form;

  return (
    <RHFFormBase onSubmit={handleSubmit}>
      <RHFInput
        name='name'
        control={control}
        label='Name'
        required
        // Error sẽ hiện khi user unfocus field trống
        // Error sẽ biến mất khi user điền giá trị hợp lệ
      />

      <RHFInput
        name='email'
        control={control}
        label='Email'
        type='email'
        required
        // Tương tự cho tất cả fields
      />
    </RHFFormBase>
  );
};
```

## ⚡ Performance Notes

- **onBlur mode**: Chỉ validate khi cần thiết, không spam validation
- **reValidateMode onChange**: Chỉ re-validate sau khi field đã được touched
- **Zod resolver**: Validation schema được compile một lần, tái sử dụng
- **React Hook Form**: Chỉ re-render field có thay đổi, không re-render toàn form
