// Format date to readable string
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// Check if date is today
export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const target = new Date(date);
  
  return today.toDateString() === target.toDateString();
};

// Check if date is yesterday
export const isYesterday = (date: Date | string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const target = new Date(date);
  
  return yesterday.toDateString() === target.toDateString();
};

// Check if date is this week
export const isThisWeek = (date: Date | string): boolean => {
  const now = new Date();
  const target = new Date(date);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  return target >= startOfWeek;
};

// Check if date is this month
export const isThisMonth = (date: Date | string): boolean => {
  const now = new Date();
  const target = new Date(date);
  
  return now.getMonth() === target.getMonth() && 
         now.getFullYear() === target.getFullYear();
};

// Check if date is this year
export const isThisYear = (date: Date | string): boolean => {
  const now = new Date();
  const target = new Date(date);
  
  return now.getFullYear() === target.getFullYear();
};

// Add days to date
export const addDays = (date: Date | string, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Subtract days from date
export const subtractDays = (date: Date | string, days: number): Date => {
  return addDays(date, -days);
};

// Get start of day
export const startOfDay = (date: Date | string): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Get end of day
export const endOfDay = (date: Date | string): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Get start of week
export const startOfWeek = (date: Date | string): Date => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Get end of week
export const endOfWeek = (date: Date | string): Date => {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Get start of month
export const startOfMonth = (date: Date | string): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Get end of month
export const endOfMonth = (date: Date | string): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Calculate age from birth date
export const calculateAge = (birthDate: Date | string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
