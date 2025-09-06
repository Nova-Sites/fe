// Generate random string
export const generateRandomCryptoString = (length: number = 32): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate random number
export const generateRandomNumber = (
  min: number = 0,
  max: number = 100
): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate UUID v4
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Hash string (simple hash function)
export const simpleHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
};

// Generate secure token
export const generateSecureToken = (length: number = 64): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Generate API key
export const generateAPIKey = (prefix: string = 'api'): string => {
  const timestamp = Date.now().toString(36);
  const random = generateSecureToken(16);
  return `${prefix}_${timestamp}_${random}`;
};

// Generate password hash (simple implementation)
export const hashPassword = (password: string, salt: string = ''): string => {
  const saltedPassword = password + salt;
  let hash = 0;

  for (let i = 0; i < saltedPassword.length; i++) {
    const char = saltedPassword.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(36);
};

// Verify password
export const verifyPassword = (
  password: string,
  hash: string,
  salt: string = ''
): boolean => {
  return hashPassword(password, salt) === hash;
};

// Generate salt
export const generateSalt = (length: number = 16): string => {
  return generateSecureToken(length);
};

// Encrypt text (simple Caesar cipher for demo purposes)
export const encryptText = (text: string, shift: number = 3): string => {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
};

// Decrypt text
export const decryptText = (text: string, shift: number = 3): string => {
  return encryptText(text, 26 - shift);
};

// Generate checksum
export const generateChecksum = (data: string): string => {
  let checksum = 0;
  for (let i = 0; i < data.length; i++) {
    checksum += data.charCodeAt(i);
  }
  return checksum.toString(16);
};

// Validate checksum
export const validateChecksum = (data: string, checksum: string): boolean => {
  return generateChecksum(data) === checksum;
};
