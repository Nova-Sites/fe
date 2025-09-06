// Sanitize HTML content
export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi, '')
    .replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, '')
    .replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '')
    .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*>/gi, '')
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '');
};

// Sanitize text content
export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Sanitize URL
export const sanitizeUrl = (url: string): string => {
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '';
    }
  }

  // Ensure URL starts with http or https
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }

  return url;
};

// Sanitize email
export const sanitizeEmail = (email: string): string => {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, '');
};

// Sanitize phone number
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+\-()\s]/g, '').trim();
};

// Sanitize filename
export const sanitizeFilenameText = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
};

// Sanitize object properties
export const sanitizeObject = <T extends Record<string, unknown>>(
  obj: T,
  allowedKeys: string[] = []
): Partial<T> => {
  const sanitized: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (allowedKeys.length === 0 || allowedKeys.includes(key)) {
      if (typeof value === 'string') {
        sanitized[key as keyof T] = sanitizeText(value) as T[keyof T];
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key as keyof T] = sanitizeObject(
          value,
          allowedKeys
        ) as T[keyof T];
      } else {
        sanitized[key as keyof T] = value;
      }
    }
  }

  return sanitized;
};

// Sanitize array of strings
export const sanitizeStringArray = (arr: string[]): string[] => {
  return arr
    .filter(item => typeof item === 'string')
    .map(item => sanitizeText(item))
    .filter(item => item.length > 0);
};

// Remove XSS attempts
export const removeXSS = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
    .replace(/onmouseover\s*=/gi, '')
    .replace(/onfocus\s*=/gi, '')
    .replace(/onblur\s*=/gi, '')
    .replace(/onchange\s*=/gi, '')
    .replace(/onsubmit\s*=/gi, '')
    .replace(/onreset\s*=/gi, '')
    .replace(/onselect\s*=/gi, '')
    .replace(/onunload\s*=/gi, '')
    .replace(/onresize\s*=/gi, '')
    .replace(/onkeydown\s*=/gi, '')
    .replace(/onkeyup\s*=/gi, '')
    .replace(/onkeypress\s*=/gi, '');
};

// Sanitize SQL injection attempts
export const removeSQLInjection = (input: string): string => {
  const sqlKeywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'CREATE',
    'ALTER',
    'UNION',
    'EXEC',
    'EXECUTE',
    'SCRIPT',
    'DECLARE',
    'CAST',
    'CONVERT',
  ];

  let sanitized = input;
  for (const keyword of sqlKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '');
  }

  return sanitized
    .replace(/['";]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
};

// Sanitize HTML attributes
export const sanitizeHtmlAttributes = (
  attributes: Record<string, string>
): Record<string, string> => {
  const allowedAttributes = [
    'class',
    'id',
    'style',
    'title',
    'alt',
    'src',
    'href',
    'target',
    'width',
    'height',
    'border',
    'cellpadding',
    'cellspacing',
  ];

  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(attributes)) {
    if (allowedAttributes.includes(key.toLowerCase())) {
      sanitized[key] = sanitizeText(value);
    }
  }

  return sanitized;
};
