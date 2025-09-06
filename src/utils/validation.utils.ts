// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Slug validation
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

// Number validation
export const isValidNumber = (value: number): boolean => {
  return !isNaN(value) && isFinite(value);
};

// Integer validation
export const isValidInteger = (value: number): boolean => {
  return Number.isInteger(Number(value));
};

// Positive number validation
export const isPositiveNumber = (value: number): boolean => {
  return isValidNumber(value) && Number(value) > 0;
};

// Date validation
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Future date validation
export const isFutureDate = (date: string): boolean => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

// Past date validation
export const isPastDate = (date: string): boolean => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

// File size validation (in bytes)
export const isValidFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};

// File type validation
export const isValidFileType = (
  filename: string,
  allowedTypes: string[]
): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

// Image file validation
export const isValidImageFile = (filename: string): boolean => {
  const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  return isValidFileType(filename, allowedTypes);
};

// Document file validation
export const isValidDocumentFile = (filename: string): boolean => {
  const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  return isValidFileType(filename, allowedTypes);
};
