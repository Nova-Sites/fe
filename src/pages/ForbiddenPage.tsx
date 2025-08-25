import React from 'react';
import { Link } from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl mb-6">Bạn không có quyền truy cập trang này.</p>
      <Link to="/" className="text-blue-600 hover:underline">Về trang chủ</Link>
    </div>
  );
};

export default ForbiddenPage;


