import { MetaTitleBase } from '@/components/common';
import { SEO_META } from '@/constants';
import React from 'react';

const AdminProductsPage: React.FC = () => {
  return (
    <div className='p-6'>
      <MetaTitleBase
        title={SEO_META.ADMIN.PRODUCTS.TITLE}
        description={SEO_META.ADMIN.PRODUCTS.DESCRIPTION}
      />
      <h1 className='text-2xl font-bold mb-4'>Products</h1>
      <p className='text-gray-600'>Manage products here.</p>
    </div>
  );
};

export default AdminProductsPage;
