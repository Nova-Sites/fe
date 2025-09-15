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
import DialogForm from '@/components/admin/Categories/DialogForm';
import { Category } from '@/types';
import { CategoryCreateInput } from '@/utils/validation/schemas';
import { useCategories } from '@/hooks';

const AdminCategoriesPage: React.FC = () => {
  // Use categories hook
  const {
    categories: allCategories,
    isLoading: categoriesLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetchCategories,
  } = useCategories();

  const [page, setPage] = React.useState<number>(1); // 1-based
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Category | null>('name');
  const [search, setSearch] = React.useState<string>('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Combined loading state
  const isLoading = categoriesLoading || loading;

  // Filter by search
  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allCategories;
    return allCategories.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.slug.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
    );
  }, [allCategories, search]);

  // Sort
  const sorted = React.useMemo(() => {
    if (!orderBy) return filtered;
    const data = [...filtered];
    data.sort((a, b) => {
      const av = a[orderBy];
      const bv = b[orderBy];
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'asc' ? av - bv : bv - av;
      }
      return order === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return data;
  }, [filtered, order, orderBy]);

  // Paginate
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, rowsPerPage)));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageRows = sorted.slice(start, end);

  const handleRequestSort = (property: keyof Category) => {
    if (orderBy === property) {
      setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(property);
      setOrder('asc');
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setMessage(null);
  };

  const handleSubmitCategory = async (data: CategoryCreateInput) => {
    setLoading(true);
    console.log('data creaate', data);

    try {
      let result;

      if (editingCategory) {
        // Update existing category
        result = await updateCategory(editingCategory.id, data);
        if (result.success) {
          setMessage({
            type: 'success',
            text: 'Category updated successfully!',
          });
          await refetchCategories();
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Failed to update category',
          });
        }
      } else {
        // Create new category
        result = await createCategory(data);
        if (result.success) {
          setMessage({
            type: 'success',
            text: 'Category created successfully!',
          });
          await refetchCategories();
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Failed to create category',
          });
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to save category',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setLoading(true);
    try {
      const result = await deleteCategory(categoryToDelete.id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Category deleted successfully!' });
        await refetchCategories();
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to delete category',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to delete category',
      });
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className='p-6'>
      <MetaTitleBase
        title={SEO_META.ADMIN.CATEGORIES.TITLE}
        description={SEO_META.ADMIN.CATEGORIES.DESCRIPTION}
      />

      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Categories</h1>
          <p className='text-gray-600'>Manage categories here.</p>
        </div>
        <ButtonBase variant='primary' onClick={handleCreateCategory} size='md'>
          Create Category
        </ButtonBase>
      </div>

      {message && (
        <div className='mb-4'>
          <AlertBase severity={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </AlertBase>
        </div>
      )}

      {isLoading && <LoadingBase />}

      <DataTableBase<Category>
        title='Categories'
        columns={[
          {
            id: 'id',
            label: 'ID',
            sortable: true,
            minWidth: 80,
          },
          {
            id: 'name',
            label: 'Name',
            sortable: true,
            minWidth: 150,
          },
          {
            id: 'slug',
            label: 'Slug',
            sortable: true,
            minWidth: 120,
          },
          {
            id: 'description',
            label: 'Description',
            sortable: true,
            minWidth: 200,
          },
          {
            id: 'image',
            label: 'Image',
            sortable: false,
            minWidth: 100,
            render: (category: Category) => (
              <img
                src={category.image}
                alt={category.name}
                className='w-12 h-8 object-cover rounded'
              />
            ),
          },
          {
            id: 'actions' as keyof Category,
            label: 'Actions',
            sortable: false,
            minWidth: 120,
            render: (category: Category) => (
              <div className='flex gap-1'>
                <Tooltip title='Edit Category'>
                  <IconButton
                    size='small'
                    onClick={e => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                    color='primary'
                  >
                    <Edit fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete Category'>
                  <IconButton
                    size='small'
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteCategory(category);
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
        rows={pageRows}
        total={total}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        onPageChange={p => setPage(p)}
        onRowsPerPageChange={rpp => {
          setRowsPerPage(rpp);
          setPage(1);
        }}
        checkboxSelection={false}
        selectedIds={[]}
        onSelectAllClick={() => {}}
        searchable={true}
        searchPlaceholder='Search categories'
        searchValue={search}
        onSearchChange={value => {
          setSearch(value);
          setPage(1);
        }}
      />

      <DialogForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitCategory}
        category={editingCategory}
        loading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DialogBase
        open={deleteConfirmOpen}
        onClose={cancelDelete}
        title='Delete Category'
        maxWidth='sm'
        fullWidth
      >
        <div className='p-6'>
          <div className='mb-4'>
            <p className='text-gray-700'>
              Are you sure you want to delete the category{' '}
              <strong>"{categoryToDelete?.name}"</strong>?
            </p>
            <p className='text-sm text-gray-500 mt-2'>
              This action cannot be undone. All products in this category will
              be affected.
            </p>
          </div>

          <div className='flex justify-end gap-3'>
            <ButtonBase
              variant='outline'
              onClick={cancelDelete}
              disabled={loading}
            >
              Cancel
            </ButtonBase>
            <ButtonBase
              variant='danger'
              onClick={confirmDelete}
              loading={loading}
            >
              Delete Category
            </ButtonBase>
          </div>
        </div>
      </DialogBase>
    </div>
  );
};

export default AdminCategoriesPage;
