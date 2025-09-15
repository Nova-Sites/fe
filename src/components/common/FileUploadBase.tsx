import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface FileUploadBaseProps {
  onFileSelect: (file: File | File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  preview?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  helperText?: string;
  maxFiles?: number;
}

const FileUploadBase: React.FC<FileUploadBaseProps> = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  preview = true,
  multiple = false,
  disabled = false,
  className,
  label,
  error,
  helperText,
  maxFiles = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    // Validate files
    for (const file of fileArray) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        continue;
      }

      // Check file type
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        alert(`File ${file.name} is not a valid file type.`);
        continue;
      }

      validFiles.push(file);
    }

    // Check max files limit
    if (multiple && validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onFileSelect([...selectedFiles, ...validFiles]);
    } else {
      setSelectedFiles(validFiles);
      onFileSelect(validFiles[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(multiple ? newFiles : newFiles[0] || null);
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon />;
    }
    return <InsertDriveFileIcon />;
  };

  return (
    <Box className={className}>
      {label && (
        <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
          {label}
        </Typography>
      )}

      <Paper
        variant='outlined'
        sx={{
          p: 2,
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
          backgroundColor: dragActive ? '#f5f5f5' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <Stack spacing={2} alignItems='center'>
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant='body2' color='text.secondary' textAlign='center'>
            {dragActive
              ? 'Drop files here'
              : 'Click to upload or drag and drop'}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {accept} • Max {maxSize}MB {multiple && `• Max ${maxFiles} files`}
          </Typography>
          <Button
            variant='outlined'
            size='small'
            disabled={disabled}
            onClick={e => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            Choose Files
          </Button>
        </Stack>
      </Paper>

      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {preview && selectedFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
            Selected Files:
          </Typography>
          <Stack spacing={1}>
            {selectedFiles.map((file, index) => (
              <Paper
                key={index}
                variant='outlined'
                sx={{
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getFileIcon(file)}
                  <Box>
                    <Typography variant='body2' noWrap sx={{ maxWidth: 200 }}>
                      {file.name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size='small'
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {(error || helperText) && (
        <Typography
          variant='caption'
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 1, display: 'block' }}
        >
          {error || helperText}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadBase;
