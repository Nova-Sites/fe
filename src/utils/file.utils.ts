// Get file extension
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Get file name without extension
export const getFileNameWithoutExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, '');
};

// Get file size in human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if file is image
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};

// Check if file is video
export const isVideoFile = (filename: string): boolean => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  const extension = getFileExtension(filename);
  return videoExtensions.includes(extension);
};

// Check if file is audio
export const isAudioFile = (filename: string): boolean => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma'];
  const extension = getFileExtension(filename);
  return audioExtensions.includes(extension);
};

// Check if file is document
export const isDocumentFile = (filename: string): boolean => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  const extension = getFileExtension(filename);
  return documentExtensions.includes(extension);
};

// Check if file is archive
export const isArchiveFile = (filename: string): boolean => {
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
  const extension = getFileExtension(filename);
  return archiveExtensions.includes(extension);
};

// Generate unique filename
export const generateUniqueFilename = (originalName: string, prefix: string = ''): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const nameWithoutExt = getFileNameWithoutExtension(originalName);
  
  return `${prefix}${nameWithoutExt}_${timestamp}_${random}.${extension}`;
};

// Sanitize filename
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Get MIME type from extension
export const getMimeType = (extension: string): string => {
  const mimeTypes: { [key: string]: string } = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
    
    // Videos
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    'mkv': 'video/x-matroska',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'aac': 'audio/aac',
    'flac': 'audio/flac',
    'wma': 'audio/x-ms-wma',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'rtf': 'application/rtf',
    'odt': 'application/vnd.oasis.opendocument.text',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
    'bz2': 'application/x-bzip2'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

// Validate file upload
export const validateFileUpload = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { isValid: boolean; error?: string } => {
  const { maxSize, allowedTypes, allowedExtensions } = options;
  
  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`
    };
  }
  
  // Check MIME type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`
    };
  }
  
  // Check file extension
  if (allowedExtensions) {
    const extension = getFileExtension(file.name);
    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension .${extension} is not allowed`
      };
    }
  }
  
  return { isValid: true };
};
