# RHFInput Usage Guide

## Overview

RHFInput is a powerful React Hook Form input component that automatically handles different input types with built-in transformations and validation.

## Supported Types

### 1. Text Input

```tsx
<RHFInput
  name='name'
  control={control}
  label='Full Name'
  placeholder='Enter your full name'
/>
```

### 2. Number Input

```tsx
<RHFInput
  name='price'
  control={control}
  label='Price'
  type='number'
  min={0}
  step={0.01}
  helperText='Enter price in USD'
/>
```

### 3. Email Input

```tsx
<RHFInput name='email' control={control} label='Email' type='email' required />
// Auto-generates:
// - placeholder: "example@email.com"
// - helperText: "Enter a valid email address"
// - autoComplete: "email"
```

### 4. Phone Input

```tsx
<RHFInput
  name='phone'
  control={control}
  label='Phone'
  type='tel'
  maxLength={15}
/>
// Auto-generates:
// - placeholder: "+1 (555) 123-4567"
// - helperText: "Enter a valid phone number"
// - autoComplete: "tel"
// - Auto-removes non-numeric characters except +, -, (, ), space
```

### 5. URL Input

```tsx
<RHFInput name='website' control={control} label='Website' type='url' />
// Auto-generates:
// - placeholder: "https://example.com"
// - helperText: "Enter a valid URL"
// - autoComplete: "url"
// - Auto-adds https:// if missing
```

### 6. Password Input

```tsx
<RHFInput
  name='password'
  control={control}
  label='Password'
  type='password'
  required
/>
// Auto-generates:
// - placeholder: "Enter password"
// - helperText: "Enter a secure password"
// - autoComplete: "current-password"
```

### 7. Multiline Text

```tsx
<RHFInput
  name='description'
  control={control}
  label='Description'
  multiline
  rows={4}
  maxLength={500}
/>
```

## Advanced Features

### Custom Transform

```tsx
<RHFInput
  name='customField'
  control={control}
  type='text'
  transform={{
    input: value => value || '',
    output: value => value.toUpperCase(),
  }}
/>
```

### With Icons

```tsx
import { Email, Lock } from '@mui/icons-material';

<RHFInput
  name="email"
  control={control}
  type="email"
  leftIcon={<Email />}
/>

<RHFInput
  name="password"
  control={control}
  type="password"
  rightIcon={<Lock />}
/>
```

### With Validation

```tsx
<RHFInput
  name='phone'
  control={control}
  type='tel'
  pattern='[0-9+\-() ]+'
  maxLength={15}
  required
/>
```

## Props

| Prop           | Type               | Default  | Description                                                |
| -------------- | ------------------ | -------- | ---------------------------------------------------------- |
| `name`         | `FieldPath<T>`     | -        | Field name for React Hook Form                             |
| `control`      | `Control<T>`       | -        | React Hook Form control                                    |
| `type`         | `string`           | `'text'` | Input type (text, number, email, tel, url, password)       |
| `label`        | `string`           | -        | Field label                                                |
| `placeholder`  | `string`           | -        | Placeholder text (auto-generated for special types)        |
| `helperText`   | `string`           | -        | Helper text (auto-generated for special types)             |
| `required`     | `boolean`          | `false`  | Whether field is required                                  |
| `disabled`     | `boolean`          | `false`  | Whether field is disabled                                  |
| `fullWidth`    | `boolean`          | `true`   | Whether field takes full width                             |
| `multiline`    | `boolean`          | `false`  | Whether field is multiline                                 |
| `rows`         | `number`           | -        | Number of rows for multiline                               |
| `autoComplete` | `string`           | -        | Auto-complete attribute (auto-generated for special types) |
| `autoFocus`    | `boolean`          | -        | Whether field should auto-focus                            |
| `maxLength`    | `number`           | -        | Maximum character length                                   |
| `min`          | `number \| string` | -        | Minimum value (for number inputs)                          |
| `max`          | `number \| string` | -        | Maximum value (for number inputs)                          |
| `step`         | `number \| string` | -        | Step value (for number inputs)                             |
| `pattern`      | `string`           | -        | Pattern for validation                                     |
| `leftIcon`     | `ReactNode`        | -        | Left icon                                                  |
| `rightIcon`    | `ReactNode`        | -        | Right icon                                                 |
| `transform`    | `object`           | -        | Custom input/output transformation                         |
| `className`    | `string`           | -        | Additional CSS class                                       |

## Auto-Generated Features

### Type-Specific Transformations

- **Number**: Converts string input to number, handles empty values as 0
- **Email**: Trims whitespace and converts to lowercase
- **Tel**: Removes non-numeric characters except +, -, (, ), space
- **URL**: Adds https:// protocol if missing
- **Password**: No transformation (passes through)

### Type-Specific Defaults

- **Email**: `placeholder="example@email.com"`, `helperText="Enter a valid email address"`, `autoComplete="email"`
- **Tel**: `placeholder="+1 (555) 123-4567"`, `helperText="Enter a valid phone number"`, `autoComplete="tel"`
- **URL**: `placeholder="https://example.com"`, `helperText="Enter a valid URL"`, `autoComplete="url"`
- **Password**: `placeholder="Enter password"`, `helperText="Enter a secure password"`, `autoComplete="current-password"`
- **Number**: `placeholder="0"`, `helperText="Enter a number"`, `autoComplete="off"`

## Examples

### Complete Form Example

```tsx
import { useForm } from 'react-hook-form';
import { RHFInput } from '@/components/common';

const MyForm = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = data => {
    console.log(data);
    // data.price will be a number
    // data.email will be lowercase and trimmed
    // data.phone will have non-numeric characters removed
    // data.website will have https:// added if missing
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RHFInput name='name' control={control} label='Full Name' required />

      <RHFInput name='email' control={control} type='email' required />

      <RHFInput name='phone' control={control} type='tel' required />

      <RHFInput name='website' control={control} type='url' />

      <RHFInput
        name='price'
        control={control}
        type='number'
        min={0}
        step={0.01}
        required
      />

      <RHFInput
        name='description'
        control={control}
        label='Description'
        multiline
        rows={4}
        maxLength={500}
      />
    </form>
  );
};
```

## Best Practices

1. **Use appropriate types**: Let RHFInput handle the transformations automatically
2. **Override when needed**: You can still provide custom placeholder, helperText, or autoComplete
3. **Combine with validation**: Use with Zod schemas for comprehensive validation
4. **Use icons sparingly**: Only add icons when they provide clear value
5. **Test edge cases**: Especially for number inputs and custom transforms
