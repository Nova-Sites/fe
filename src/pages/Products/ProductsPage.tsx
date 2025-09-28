import React, { useState } from 'react';
import { UserLayout } from '@/components/layouts';
import { LoadingBase, MetaTitleBase } from '@/components/common';
import type { ProductFilters, Product, TechStack } from '@/types';
import { SEO_META } from '@/constants';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  Box,
  TextField,
  Pagination,
  Tooltip,
} from '@mui/material';
import { useProducts } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';

const truncate = (text: string, length = 120) =>
  text.length > length ? text.slice(0, length) + '…' : text;

const TechStackChips: React.FC<{ techStacks?: TechStack[] }> = ({
  techStacks,
}) => {
  if (!techStacks || techStacks.length === 0) return null;
  const visible = techStacks.slice(0, 3);
  const extra = techStacks.length - visible.length;
  return (
    <Stack direction='row' spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
      {visible.map(ts => (
        <Chip key={ts.id} label={ts.name} size='small' variant='outlined' />
      ))}
      {extra > 0 && (
        <Chip label={`+${extra}`} size='small' variant='outlined' />
      )}
    </Stack>
  );
};

const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    search: '',
    categoryId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const { products, pagination, isLoading, error } = useProducts(filters);

  if (isLoading) return <LoadingBase />;

  if (error) {
    return (
      <UserLayout>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center text-red-600'>
            Error loading products. Please try again later.
          </div>
        </div>
      </UserLayout>
    );
  }

  const totalPages = pagination?.totalPages || 1;

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  return (
    <UserLayout>
      <div className='container mx-auto px-4 py-8'>
        <MetaTitleBase
          title={SEO_META.PUBLIC.PRODUCTS.TITLE}
          description={SEO_META.PUBLIC.PRODUCTS.DESCRIPTION}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <div>
            <h1 className='text-3xl font-bold'>Website Marketplace</h1>
            <p className='text-gray-600'>Browse and buy ready-made websites</p>
          </div>
          <TextField
            size='small'
            placeholder='Search websites...'
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {products.map((product: Product) => (
            <Card key={product.id} elevation={2} sx={{ height: '100%' }}>
              <Link
                to={`/products/${product.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <CardActionArea component='div'>
                  <CardMedia
                    component='img'
                    height='160'
                    image={product.image}
                    alt={product.name}
                    loading='lazy'
                  />
                  <CardContent>
                    <Stack
                      direction='row'
                      spacing={1}
                      alignItems='center'
                      sx={{ mb: 1 }}
                    >
                      {product.category?.name && (
                        <Chip
                          label={product.category.name}
                          size='small'
                          color='primary'
                          variant='outlined'
                        />
                      )}
                      <Tooltip title={`${product.views} views`}>
                        <Chip
                          label={`${product.views} views`}
                          size='small'
                          variant='outlined'
                        />
                      </Tooltip>
                    </Stack>
                    <Typography variant='h6' component='h3' gutterBottom noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {truncate(product.description)}
                    </Typography>
                    <TechStackChips techStacks={product.techStacks} />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 2,
                      }}
                    >
                      <Typography variant='h6' color='primary'>
                        ${product.price}
                      </Typography>
                      <Typography
                        component='span'
                        variant='body2'
                        color='primary'
                      >
                        View
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          ))}
        </Box>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={filters.page || 1}
              onChange={handlePageChange}
              color='primary'
              shape='rounded'
            />
          </Box>
        )}
      </div>
    </UserLayout>
  );
};

export default ProductsPage;
