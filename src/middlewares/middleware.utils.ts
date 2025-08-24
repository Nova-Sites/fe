// Validation rule interface
export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
  type?: 'string' | 'number' | 'email' | 'url' | 'phone';
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validate data against rules
export const validateData = (data: Record<string, any>, rules: ValidationRule[]): string[] => {
  const errors: string[] = [];

  rules.forEach(rule => {
    const value = data[rule.field];
    
    // Required check
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(rule.message || `${rule.field} is required`);
      return;
    }

    // Skip other validations if value is empty and not required
    if (!value) return;

    // Type validation
    if (rule.type) {
      const typeError = validateType(value, rule.type);
      if (typeError) {
        errors.push(rule.message || typeError);
        return;
      }
    }

    // Min length check
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      errors.push(rule.message || `${rule.field} must be at least ${rule.minLength} characters`);
    }

    // Max length check
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      errors.push(rule.message || `${rule.field} must be no more than ${rule.maxLength} characters`);
    }

    // Pattern check
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(rule.message || `${rule.field} format is invalid`);
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push(rule.message || `${rule.field} validation failed`);
    }
  });

  return errors;
};

// Validate data type
export const validateType = (value: any, type: string): string | null => {
  switch (type) {
    case 'string':
      return typeof value === 'string' ? null : 'Value must be a string';
    
    case 'number':
      return !isNaN(value) && isFinite(value) ? null : 'Value must be a number';
    
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : 'Value must be a valid email';
    
    case 'url':
      try {
        new URL(value);
        return null;
      } catch {
        return 'Value must be a valid URL';
      }
    
    case 'phone':
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value) ? null : 'Value must be a valid phone number';
    
    default:
      return null;
  }
};

// Create validation rules for common fields
export const createValidationRules = {
  email: (required: boolean = true): ValidationRule => ({
    field: 'email',
    required,
    type: 'email',
    message: 'Please enter a valid email address'
  }),

  password: (required: boolean = true, minLength: number = 8): ValidationRule => ({
    field: 'password',
    required,
    minLength,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  }),

  phone: (required: boolean = true): ValidationRule => ({
    field: 'phone',
    required,
    type: 'phone',
    message: 'Please enter a valid phone number'
  }),

  url: (required: boolean = true): ValidationRule => ({
    field: 'url',
    required,
    type: 'url',
    message: 'Please enter a valid URL'
  }),

  required: (field: string, message?: string): ValidationRule => ({
    field,
    required: true,
    message: message || `${field} is required`
  }),

  minLength: (field: string, minLength: number, message?: string): ValidationRule => ({
    field,
    minLength,
    message: message || `${field} must be at least ${minLength} characters`
  }),

  maxLength: (field: string, maxLength: number, message?: string): ValidationRule => ({
    field,
    maxLength,
    message: message || `${field} must be no more than ${maxLength} characters`
  }),

  pattern: (field: string, pattern: RegExp, message?: string): ValidationRule => ({
    field,
    pattern,
    message: message || `${field} format is invalid`
  })
};

// Middleware execution chain
export const executeMiddlewareChain = async (
  middlewares: Array<(context: any) => Promise<boolean>>,
  context: any
): Promise<{ success: boolean; context: any; errors: string[] }> => {
  const errors: string[] = [];
  
  for (const middleware of middlewares) {
    try {
      const result = await middleware(context);
      if (!result) {
        errors.push('Middleware execution failed');
        break;
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown error');
      break;
    }
  }
  
  return {
    success: errors.length === 0,
    context,
    errors
  };
};

// Create middleware chain
export const createMiddlewareChain = <T>(
  ...middlewares: Array<(context: T) => Promise<boolean>>
) => {
  return async (context: T) => {
    return executeMiddlewareChain(middlewares, context);
  };
};
