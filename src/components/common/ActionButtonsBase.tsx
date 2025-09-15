import React from 'react';
import { Stack } from '@mui/material';
import Button from './ButtonBase';

interface ActionButtonsBaseProps {
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  saveText?: string;
  cancelText?: string;
  saveVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  cancelVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
  className?: string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  spacing?: number;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  fullWidth?: boolean;
}

const ActionButtonsBase: React.FC<ActionButtonsBaseProps> = ({
  onSave,
  onCancel,
  loading = false,
  saveText = 'Save',
  cancelText = 'Cancel',
  saveVariant = 'primary',
  cancelVariant = 'outline',
  disabled = false,
  className,
  direction = 'row',
  spacing = 2,
  justifyContent = 'flex-end',
  fullWidth = false,
}) => {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      justifyContent={justifyContent}
      className={className}
      sx={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <Button
        variant={cancelVariant}
        onClick={onCancel}
        disabled={disabled || loading}
        fullWidth={fullWidth}
      >
        {cancelText}
      </Button>

      <Button
        variant={saveVariant}
        onClick={e => {
          console.log('🔘 ActionButtonsBase: Save button clicked');
          e.preventDefault();
          onSave();
        }}
        loading={loading}
        disabled={disabled}
        fullWidth={fullWidth}
        type='button'
      >
        {saveText}
      </Button>
    </Stack>
  );
};

export default ActionButtonsBase;
