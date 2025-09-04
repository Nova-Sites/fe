import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { visuallyHidden } from '@mui/utils';
import Pagination from './Pagination';
import { ROWS_PER_PAGE_OPTIONS } from '@/constants';

export type SortOrder = 'asc' | 'desc';

export interface DataTableColumn<T> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  minWidth?: number;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T extends { id: string | number }> {
  title?: string;
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  total: number; // total row count across all pages
  page: number; // 1-based page index
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  order?: SortOrder;
  orderBy?: keyof T | null;
  onRequestSort?: (property: keyof T) => void;
  onPageChange?: (page: number) => void; // 1-based
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  // Selection (optional)
  checkboxSelection?: boolean;
  selectedIds?: Array<T['id']>;
  onSelectAllClick?: (checked: boolean) => void;
  onRowSelectChange?: (id: T['id'], checked: boolean) => void;
  onRowClick?: (row: T) => void;
  // Search (optional)
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

function DataTable<T extends { id: string | number }>(props: DataTableProps<T>) {
  const {
    title,
    columns,
    rows,
    total,
    page,
    rowsPerPage,
    rowsPerPageOptions = ROWS_PER_PAGE_OPTIONS,
    order = 'asc',
    orderBy = null,
    onRequestSort,
    onPageChange,
    onRowsPerPageChange,
    checkboxSelection = false,
    selectedIds = [],
    onSelectAllClick,
    onRowSelectChange,
    onRowClick,
    searchable = false,
    searchPlaceholder = 'Search…',
    searchValue = '',
    onSearchChange,
  } = props;

  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, rowsPerPage)));

  const createSortHandler = (property: keyof T) => () => {
    if (onRequestSort) onRequestSort(property);
  };

  const allSelected = checkboxSelection && rows.length > 0 && selectedIds.length === rows.length;
  const someSelected = checkboxSelection && selectedIds.length > 0 && selectedIds.length < rows.length;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {(title || searchable) && (
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {searchable && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          )}
        </Toolbar>
      )}

      <TableContainer>
        <Table aria-label="data table">
          <TableHead>
            <TableRow>
              {checkboxSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={someSelected}
                    checked={allSelected}
                    onChange={(e) => onSelectAllClick && onSelectAllClick(e.target.checked)}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.numeric ? 'right' : 'left'}
                  padding={col.minWidth ? 'normal' : 'normal'}
                  sortDirection={orderBy === col.id ? order : false}
                  sx={{ minWidth: col.minWidth }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : 'asc'}
                      onClick={createSortHandler(col.id)}
                    >
                      {col.label}
                      {orderBy === col.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                hover
                key={String(row.id)}
                role={onRowClick ? 'button' : undefined}
                onClick={() => onRowClick && onRowClick(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {checkboxSelection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedIds.includes(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (onRowSelectChange) onRowSelectChange(row.id, e.target.checked);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={String(col.id)} align={col.numeric ? 'right' : 'left'}>
                    {col.render ? col.render(row) : (row[col.id] as unknown as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={(checkboxSelection ? 1 : 0) + columns.length}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No data
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, gap: 2, flexWrap: 'wrap' }}>
        <Pagination
          page={page}
          count={pageCount}
          onChange={(_, p) => onPageChange && onPageChange(p)}
          size="medium"
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Stack>
    </Paper>
  );
}

export default DataTable;


