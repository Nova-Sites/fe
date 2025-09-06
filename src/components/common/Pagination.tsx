import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { ROWS_PER_PAGE_OPTIONS } from '@/constants';

interface PaginationProps {
  page: number;
  count: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  // Optional rows-per-page controls
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  count,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  size = 'medium',
  className,
  rowsPerPage,
  rowsPerPageOptions = ROWS_PER_PAGE_OPTIONS,
  onRowsPerPageChange,
}) => {
  return (
    <Stack
      className={className}
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      sx={{ width: '100%' }}
    >
      {typeof rowsPerPage === 'number' && onRowsPerPageChange ? (
        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography variant='body2' color='text.secondary'>
            Rows per page:
          </Typography>
          <Select
            size='small'
            value={rowsPerPage}
            onChange={e => onRowsPerPageChange(Number(e.target.value))}
          >
            {rowsPerPageOptions.map(opt => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      ) : (
        <span />
      )}
      <MuiPagination
        page={page}
        count={count}
        onChange={onChange}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        size={size}
        color='primary'
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};

export default Pagination;
