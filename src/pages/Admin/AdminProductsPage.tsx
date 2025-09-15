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
import DialogForm from '@/components/admin/Products/DialogForm';
import { Product } from '@/types';
import { ProductCreateInput } from '@/utils/validation/schemas';
import { useProducts, useCategories, useTechStacks } from '@/hooks';

const AdminProductsPage: React.FC = () => {
  // State for pagination, search, and sorting
  const [page, setPage] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('name');
  const [search, setSearch] = React.useState<string>('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(
    null
  );
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
  const {
    products,
    pagination,
    isLoading: productsLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetchProducts,
  } = useProducts(filters);

  const { categories } = useCategories();
  const { techStacks } = useTechStacks();

  // Combined loading state
  const isLoading = productsLoading || loading;

  const handleRequestSort = (property: string) => {
    if (orderBy === property) {
      setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(property);
      setOrder('asc');
    }
    setPage(1); // Reset to first page when sorting
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setMessage(null);
  };

  const handleSubmitProduct = async (data: ProductCreateInput) => {
    setLoading(true);

    try {
      let result;

      if (editingProduct) {
        // Update existing product
        if (editingProduct.id === undefined) {
          throw new Error('Product ID is missing for update');
        }
        result = await updateProduct(editingProduct.id, data);
        if (result.success) {
          setMessage({
            type: 'success',
            text: 'Product updated successfully!',
          });
          await refetchProducts();
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Failed to update product',
          });
        }
      } else {
        // Create new product
        result = await createProduct(data);
        if (result.success) {
          setMessage({
            type: 'success',
            text: 'Product created successfully!',
          });
          await refetchProducts();
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Failed to create product',
          });
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save product',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setLoading(true);
    try {
      if (productToDelete.id === undefined) {
        throw new Error('Product ID is missing for deletion');
      }
      const result = await deleteProduct(productToDelete.id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        await refetchProducts();
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to delete product',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to delete product',
      });
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
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
        title={SEO_META.ADMIN.PRODUCTS.TITLE}
        description={SEO_META.ADMIN.PRODUCTS.DESCRIPTION}
      />

      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Products</h1>
          <p className='text-gray-600'>Manage products here.</p>
        </div>
        <ButtonBase variant='primary' onClick={handleCreateProduct} size='md'>
          Create Product
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

      <DataTableBase<Product>
        title='Products'
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
            minWidth: 200,
          },
          {
            id: 'slug',
            label: 'Slug',
            sortable: true,
            minWidth: 150,
          },
          {
            id: 'price',
            label: 'Price',
            sortable: true,
            minWidth: 100,
            render: (product: Product) => (
              <span className='font-medium'>${product.price}</span>
            ),
          },
          {
            id: 'category',
            label: 'Category',
            sortable: false,
            minWidth: 150,
            render: (product: Product) => (
              <span className='text-sm text-gray-600'>
                {product.category?.name || 'N/A'}
              </span>
            ),
          },
          {
            id: 'techStacks',
            label: 'Tech Stacks',
            sortable: false,
            minWidth: 200,
            render: (product: Product) => (
              <div className='flex flex-wrap gap-1'>
                {product.techStacks?.slice(0, 3).map(tech => (
                  <span
                    key={tech.id}
                    className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded'
                  >
                    {tech.name}
                  </span>
                ))}
                {product.techStacks && product.techStacks.length > 3 && (
                  <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded'>
                    +{product.techStacks.length - 3} more
                  </span>
                )}
              </div>
            ),
          },
          {
            id: 'image',
            label: 'Image',
            sortable: false,
            minWidth: 100,
            render: (product: Product) => (
              <img
                src={product.image}
                alt={product.name}
                className='w-12 h-8 object-cover rounded'
              />
            ),
          },
          {
            id: 'isActive',
            label: 'Status',
            sortable: true,
            minWidth: 100,
            render: (product: Product) => (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  product.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            ),
          },
          {
            id: 'actions' as keyof Product,
            label: 'Actions',
            sortable: false,
            minWidth: 120,
            render: (product: Product) => (
              <div className='flex gap-1'>
                <Tooltip title='Edit Product'>
                  <IconButton
                    size='small'
                    onClick={e => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                    color='primary'
                  >
                    <Edit fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete Product'>
                  <IconButton
                    size='small'
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteProduct(product);
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
        rows={products}
        total={pagination?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        order={order}
        orderBy={orderBy as keyof Product | null}
        onRequestSort={handleRequestSort}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        checkboxSelection={false}
        selectedIds={[]}
        onSelectAllClick={() => {}}
        searchable={true}
        searchPlaceholder='Search products...'
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

      <DialogForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitProduct}
        product={editingProduct}
        categories={categories}
        techStacks={techStacks}
        loading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DialogBase
        open={deleteConfirmOpen}
        onClose={cancelDelete}
        title='Delete Product'
        maxWidth='sm'
        fullWidth
      >
        <div className='p-6'>
          <div className='mb-4'>
            <p className='text-gray-700'>
              Are you sure you want to delete the product{' '}
              <strong>"{productToDelete?.name}"</strong>?
            </p>
            <p className='text-sm text-gray-500 mt-2'>
              This action cannot be undone. All associated data will be
              permanently deleted.
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
              Delete Product
            </ButtonBase>
          </div>
        </div>
      </DialogBase>
    </div>
  );
};

export default AdminProductsPage;
