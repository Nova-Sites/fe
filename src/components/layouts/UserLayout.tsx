import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { USER_ROLES } from '@/constants';
import { useLogoutMutation } from '@/services'
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/authSlice';


interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();
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
            <Link to="/" className="text-xl font-bold text-blue-600">
              Nova Sites
            </Link>

            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-blue-600">
                Products
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-blue-600">
                Categories
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                    Profile
                  </Link>
                  {user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN ? (
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                      Admin
                    </Link>
                  ) : null}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">
                      Register
                    </Button>
                  </Link>
                </>
              )}
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
          <p>&copy; 2024 Nova Sites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
