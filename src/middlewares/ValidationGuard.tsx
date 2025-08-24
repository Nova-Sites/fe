import React, { ReactNode, useState, useCallback } from 'react';
import { ValidationRule, validateData } from './middleware.utils';

interface ValidationGuardProps {
  children: ReactNode;
  data: Record<string, any>;
  rules: ValidationRule[];
  onValidationError?: (errors: string[]) => void;
  fallback?: ReactNode;
  showErrors?: boolean;
}

export const ValidationGuard: React.FC<ValidationGuardProps> = ({
  children,
  data,
  rules,
  onValidationError,
  fallback,
  showErrors = false
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback(() => {
    const validationErrors = validateData(data, rules);
    setErrors(validationErrors);
    
    if (validationErrors.length > 0 && onValidationError) {
      onValidationError(validationErrors);
    }
    
    return validationErrors.length === 0;
  }, [data, rules, onValidationError]);

  // Validate on mount and when data changes
  React.useEffect(() => {
    validate();
  }, [validate]);

  // If validation fails, show fallback or error messages
  if (errors.length > 0) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showErrors) {
      return (
        <div className="validation-errors p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Validation Errors
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600">
                {error}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  // Validation passed, render children
  return <>{children}</>;
};

export default ValidationGuard;
