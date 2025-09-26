import React from 'react';
import {
  DataTableBase,
  MetaTitleBase,
  ButtonBase,
  AlertBase,
  LoadingBase,
  DialogBase,
} from '@/components/common';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ROWS_PER_PAGE_OPTIONS, SEO_META } from '@/constants';
import DialogForm from '@/components/admin/TechStacks/DialogForm';
import { TechStack } from '@/types';
import { TechStackCreateInput } from '@/utils/validation/schemas';
import { useTechStacksList, useManageTechStacks } from '@/hooks/useTechStacks';

const AdminTechStacksPage: React.FC = () => {
  // State for pagination, search, and sorting
  const [page, setPage] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('name');
  const [search, setSearch] = React.useState<string>('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTechStack, setEditingTechStack] =
    React.useState<TechStack | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [techStackToDelete, setTechStackToDelete] =
    React.useState<TechStack | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Create filters object for API
  const filters = React.useMemo(
    () => ({
      page,
      limit: rowsPerPage,
      sortBy: orderBy,
      sortOrder: order.toUpperCase() as 'ASC' | 'DESC',
      search: search.trim() || undefined,
    }),
    [page, rowsPerPage, orderBy, order, search]
  );

  // Use hooks
  const { techStacks, pagination, isLoading, refetch } =
    useTechStacksList(filters);
  const {
    createTechStack,
    updateTechStack,
    deleteTechStack,
    isCreating,
    isUpdating,
    isDeleting,
  } = useManageTechStacks();

  const combinedLoading =
    isLoading || isCreating || isUpdating || isDeleting || loading;

  const handleRequestSort = (property: string) => {
    if (orderBy === property) {
      setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(property);
      setOrder('asc');
    }
    setPage(1); // Reset to first page when sorting
  };

  const handleCreate = () => {
    setEditingTechStack(null);
    setDialogOpen(true);
  };

  const handleEdit = (tech: TechStack) => {
    setEditingTechStack(tech);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTechStack(null);
    setMessage(null);
  };

  const handleSubmitTechStack = async (data: TechStackCreateInput) => {
    setLoading(true);

    try {
      let result;

      if (editingTechStack) {
        if (editingTechStack.id === undefined) {
          throw new Error('Tech stack ID is missing for update');
        }
        result = await updateTechStack(editingTechStack.id, data);
        if (result.success) {
          setMessage({
            type: 'success',
            text: 'Tech stack updated successfully!',
          });
          await refetch();
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Failed to update tech stack',
          });
        }
      } else {
        result = await createTechStack(data);
        if (result.success) {
          setMessage({
            type: 'success',
            text: 'Tech stack created successfully!',
          });
          await refetch();
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Failed to create tech stack',
          });
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to save tech stack',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (tech: TechStack) => {
    setTechStackToDelete(tech);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!techStackToDelete) return;

    setLoading(true);
    try {
      if (techStackToDelete.id === undefined) {
        throw new Error('Tech stack ID is missing for deletion');
      }
      const result = await deleteTechStack(techStackToDelete.id);
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Tech stack deleted successfully!',
        });
        await refetch();
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to delete tech stack',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to delete tech stack',
      });
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setTechStackToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTechStackToDelete(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className='p-6'>
      <MetaTitleBase
        title={SEO_META.ADMIN.TECH_STACKS.TITLE}
        description={SEO_META.ADMIN.TECH_STACKS.DESCRIPTION}
      />

      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Tech Stacks</h1>
          <p className='text-gray-600'>Manage tech stacks here.</p>
        </div>
        <ButtonBase variant='primary' onClick={handleCreate} size='md'>
          Create Tech Stack
        </ButtonBase>
      </div>

      {message && (
        <div className='mb-4'>
          <AlertBase severity={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </AlertBase>
        </div>
      )}

      {combinedLoading && <LoadingBase />}

      <DataTableBase<TechStack>
        title='Tech Stacks'
        columns={[
          { id: 'id', label: 'ID', sortable: true, minWidth: 80 },
          { id: 'name', label: 'Name', sortable: true, minWidth: 200 },
          { id: 'slug', label: 'Slug', sortable: true, minWidth: 150 },
          {
            id: 'iconUrl',
            label: 'Icon',
            sortable: false,
            minWidth: 100,
            render: (row: TechStack) =>
              row.iconUrl ? (
                <img
                  src={row.iconUrl}
                  alt={row.name}
                  className='w-8 h-8 object-cover rounded'
                />
              ) : (
                <span className='text-gray-400 text-sm'>N/A</span>
              ),
          },
          {
            id: 'isActive',
            label: 'Status',
            sortable: true,
            minWidth: 100,
            render: (row: TechStack) => (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  row.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {row.isActive ? 'Active' : 'Inactive'}
              </span>
            ),
          },
          {
            id: 'actions' as keyof TechStack,
            label: 'Actions',
            sortable: false,
            minWidth: 120,
            render: (row: TechStack) => (
              <div className='flex gap-1'>
                <Tooltip title='Edit Tech Stack'>
                  <IconButton
                    size='small'
                    onClick={e => {
                      e.stopPropagation();
                      handleEdit(row);
                    }}
                    color='primary'
                  >
                    <Edit fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete Tech Stack'>
                  <IconButton
                    size='small'
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(row);
                    }}
                    color='error'
                  >
                    <Delete fontSize='small' />
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]}
        rows={techStacks}
        total={pagination?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        order={order}
        orderBy={orderBy as keyof TechStack | null}
        onRequestSort={handleRequestSort}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        checkboxSelection={false}
        selectedIds={[]}
        onSelectAllClick={() => {}}
        searchable={true}
        searchPlaceholder='Search tech stacks...'
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

      <DialogForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitTechStack}
        techStack={editingTechStack}
        loading={combinedLoading}
      />

      <DialogBase
        open={deleteConfirmOpen}
        onClose={cancelDelete}
        title='Delete Tech Stack'
        maxWidth='sm'
        fullWidth
      >
        <div className='p-6'>
          <div className='mb-4'>
            <p className='text-gray-700'>
              Are you sure you want to delete the tech stack{' '}
              <strong>"{techStackToDelete?.name}"</strong>?
            </p>
            <p className='text-sm text-gray-500 mt-2'>
              This action cannot be undone.
            </p>
          </div>

          <div className='flex justify-end gap-3'>
            <ButtonBase
              variant='outline'
              onClick={cancelDelete}
              disabled={combinedLoading}
            >
              Cancel
            </ButtonBase>
            <ButtonBase
              variant='danger'
              onClick={confirmDelete}
              loading={combinedLoading}
            >
              Delete Tech Stack
            </ButtonBase>
          </div>
        </div>
      </DialogBase>
    </div>
  );
};

export default AdminTechStacksPage;
