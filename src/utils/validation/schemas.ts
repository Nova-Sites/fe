import { z } from 'zod';

// Common validation patterns
export const commonPatterns = {
  slug: /^[a-z0-9-]+$/,
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^[+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
} as const;

// Common validation messages
export const validationMessages = {
  required: 'This field is required',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  slug: 'Must contain only lowercase letters, numbers, and hyphens',
  fileSize: (maxMB: number) => `File size must be less than ${maxMB}MB`,
  fileType: (types: string[]) =>
    `File type must be one of: ${types.join(', ')}`,
} as const;

// Base schemas for reuse
export const baseSchemas = {
  requiredString: (min = 1, max = 255) =>
    z
      .string()
      .min(min, validationMessages.minLength(min))
      .max(max, validationMessages.maxLength(max))
      .trim(),

  optionalString: (max = 255) =>
    z.string().max(max, validationMessages.maxLength(max)).trim().optional(),

  email: z.string().email(validationMessages.email).trim(),

  phone: z
    .string()
    .regex(commonPatterns.phone, validationMessages.phone)
    .trim(),

  url: z.string().url(validationMessages.url).trim(),

  slug: z
    .string()
    .regex(commonPatterns.slug, validationMessages.slug)
    .min(1, validationMessages.required),

  file: (maxSizeMB = 5, acceptedTypes: string[] = ['image/*']) =>
    z
      .union([
        z.instanceof(File, { message: validationMessages.required }),
        z.string().min(1, validationMessages.required),
      ])
      .refine(
        file => {
          if (typeof file === 'string') return true; // Existing file URL
          return file.size <= maxSizeMB * 1024 * 1024;
        },
        { message: validationMessages.fileSize(maxSizeMB) }
      )
      .refine(
        file => {
          if (typeof file === 'string') return true; // Existing file URL
          return acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
              return file.type.startsWith(type.slice(0, -1));
            }
            return file.type === type;
          });
        },
        { message: validationMessages.fileType(acceptedTypes) }
      ),
};

// Category schemas
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

// Product schemas
export const productSchemas = {
  create: z.object({
    name: baseSchemas.requiredString(2, 200),
    slug: baseSchemas.slug,
    description: baseSchemas.requiredString(10, 2000),
    price: z
      .number()
      .min(0, 'Price must be greater than or equal to 0')
      .max(999999, 'Price must be less than 999,999'),
    categoryId: z.number().min(1, 'Please select a category'),
    image: baseSchemas.file(5, ['image/*']), // Main image
    images: z
      .array(baseSchemas.file(5, ['image/*']))
      .max(9, 'Maximum 9 additional images allowed')
      .optional(), // Additional images
    techStackIds: z
      .array(z.number().min(1, 'Invalid tech stack ID'))
      .max(10, 'Maximum 10 tech stacks allowed')
      .optional(),
    isActive: z.boolean().default(true),
  }),

  update: z.object({
    name: baseSchemas.requiredString(2, 200),
    slug: baseSchemas.slug,
    description: baseSchemas.requiredString(10, 2000),
    price: z
      .number()
      .min(0, 'Price must be greater than or equal to 0')
      .max(999999, 'Price must be less than 999,999'),
    categoryId: z.number().min(1, 'Please select a category'),
    image: baseSchemas.file(5, ['image/*']).optional(), // Main image
    images: z
      .array(baseSchemas.file(5, ['image/*']))
      .max(9, 'Maximum 9 additional images allowed')
      .optional(), // Additional images
    techStackIds: z
      .array(z.number().min(1, 'Invalid tech stack ID'))
      .max(10, 'Maximum 10 tech stacks allowed')
      .optional(),
    isActive: z.boolean().optional(),
  }),
};

// User schemas
export const userSchemas = {
  register: z
    .object({
      firstName: baseSchemas.requiredString(2, 50),
      lastName: baseSchemas.requiredString(2, 50),
      email: baseSchemas.email,
      phone: baseSchemas.phone.optional(),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
      confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),

  login: z.object({
    email: baseSchemas.email,
    password: z.string().min(1, validationMessages.required),
  }),

  profile: z.object({
    firstName: baseSchemas.requiredString(2, 50),
    lastName: baseSchemas.requiredString(2, 50),
    email: baseSchemas.email,
    phone: baseSchemas.phone.optional(),
    avatar: baseSchemas.file(5, ['image/*']).optional(),
  }),
};

// Search schemas
export const searchSchemas = {
  general: z.object({
    query: z
      .string()
      .min(1, 'Search query is required')
      .max(100, 'Search query too long'),
    category: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
};

// Export types
export type CategoryCreateInput = z.infer<typeof categorySchemas.create>;
export type CategoryUpdateInput = z.infer<typeof categorySchemas.update>;
export type ProductCreateInput = z.infer<typeof productSchemas.create>;
export type ProductUpdateInput = z.infer<typeof productSchemas.update>;
export type UserRegisterInput = z.infer<typeof userSchemas.register>;
export type UserLoginInput = z.infer<typeof userSchemas.login>;
export type UserProfileInput = z.infer<typeof userSchemas.profile>;
export type SearchInput = z.infer<typeof searchSchemas.general>;
