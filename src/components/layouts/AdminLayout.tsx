import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { useLogoutMutation } from '@/services'
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [logout] = useLogoutMutation()
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearAuth());
    } catch (error) {
      console.error(error)
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin" className="text-xl font-bold text-blue-600">
              Admin Dashboard
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-gray-700 hover:text-blue-600">
                Users
              </Link>
              <Link to="/admin/products" className="text-gray-700 hover:text-blue-600">
                Products
              </Link>
              <Link to="/admin/categories" className="text-gray-700 hover:text-blue-600">
                Categories
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.username || 'Admin'}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Nova Sites Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
