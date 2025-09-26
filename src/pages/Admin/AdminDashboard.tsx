import React from 'react';
import { CardBase, LoadingBase, MetaTitleBase } from '@/components/common';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetUsersQuery,
} from '@/services';
import { Product } from '@/types';
import { SEO_META } from '@/constants';

const AdminDashboard: React.FC = () => {
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({ page: 1, limit: 5 });
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const isLoading = productsLoading || categoriesLoading || usersLoading;

  if (isLoading) return <LoadingBase />;

  const products = productsData?.data?.items || [];
  const categories = categoriesData?.data || [];
  const users = usersData?.data || [];

  return (
    <div className='p-6'>
      <MetaTitleBase
        title={SEO_META.ADMIN.DASHBOARD.TITLE}
        description={SEO_META.ADMIN.DASHBOARD.DESCRIPTION}
      />
      <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <CardBase className='p-6'>
          <h3 className='text-lg font-semibold mb-2'>Total Products</h3>
          <p className='text-3xl font-bold text-blue-600'>{products.length}</p>
        </CardBase>

        <CardBase className='p-6'>
          <h3 className='text-lg font-semibold mb-2'>Total Categories</h3>
          <p className='text-3xl font-bold text-green-600'>
            {categories.length}
          </p>
        </CardBase>

        <CardBase className='p-6'>
          <h3 className='text-lg font-semibold mb-2'>Total Users</h3>
          <p className='text-3xl font-bold text-purple-600'>{users.length}</p>
        </CardBase>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <CardBase className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Recent Products</h3>
          <div className='space-y-3'>
            {products.slice(0, 5).map((product: Product) => (
              <div
                key={product.id}
                className='flex justify-between items-center'
              >
                <span className='font-medium'>{product.name}</span>
                <span className='text-gray-600'>${product.price}</span>
              </div>
            ))}
          </div>
        </CardBase>

        <CardBase className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Recent Users</h3>
          <div className='space-y-3'>
            {users.slice(0, 5).map(user => (
              <div key={user.id} className='flex justify-between items-center'>
                <span className='font-medium'>{user.username}</span>
                <span className='text-gray-600 capitalize'>
                  {user.role.replace('ROLE_', '').toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </CardBase>
      </div>
    </div>
  );
};

export default AdminDashboard;
