import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginationProps {
  page: number;
  count: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  count,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  size = 'medium',
  className,
}) => {
  return (
    <Stack className={className} direction="row" justifyContent="center">
      <MuiPagination
        page={page}
        count={count}
        onChange={onChange}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        size={size}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};

export default Pagination;


