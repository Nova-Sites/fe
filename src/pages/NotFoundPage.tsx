import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center text-center p-6'>
      <h1 className='text-6xl font-bold text-gray-800 mb-4'>404</h1>
      <p className='text-xl mb-6'>Trang bạn tìm không tồn tại.</p>
      <Link to='/' className='text-blue-600 hover:underline'>
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
