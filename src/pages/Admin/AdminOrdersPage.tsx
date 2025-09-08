import { MetaTitleBase } from '@/components/common';
import { SEO_META } from '@/constants';
import React from 'react';

const AdminOrdersPage: React.FC = () => {
  return (
    <div className='p-6'>
      <MetaTitleBase
        title={SEO_META.ADMIN.ORDERS.TITLE}
        description={SEO_META.ADMIN.ORDERS.DESCRIPTION}
      />
      <h1 className='text-2xl font-bold mb-4'>Orders</h1>
      <p className='text-gray-600'>Manage orders here.</p>
    </div>
  );
};

export default AdminOrdersPage;
