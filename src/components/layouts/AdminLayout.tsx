import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
//
import toolpadTheme from '@/themes/toolpadTheme';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, type Navigation, type Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'admin',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'products',
    title: 'Products',
    icon: <LayersIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'categories',
    title: 'Categories',
    icon: <DescriptionIcon />,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Account',
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <PersonIcon />,
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: <SettingsIcon />,
  },
  {
    kind: 'divider',
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
];

const demoTheme = toolpadTheme;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const pathnameRelativeToAdmin = React.useMemo(() => {
    if (location.pathname.startsWith('/admin')) {
      const rest = location.pathname.slice('/admin'.length);
      return rest.length === 0 ? '/' : rest;
    }
    return location.pathname;
  }, [location.pathname]);

  const router: Router = React.useMemo(
    () => ({
      pathname: pathnameRelativeToAdmin,
      searchParams: new URLSearchParams(location.search),
      navigate: (url: string | URL) => {
        const rawPath = typeof url === 'string' ? url : url.pathname;
  
        if (rawPath === '/logout') {
          logout();
          return;
        }
  
        let resolved: string;
  
        if (!rawPath || rawPath === '/') {
          resolved = '/';
        } else if (rawPath.startsWith('/admin')) {
          resolved = rawPath;
        } else {
          resolved = `/admin${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
        }
  
        navigate(resolved);
      },
    }),
    [navigate, pathnameRelativeToAdmin, location.search],
  );

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        logo: (
            <img
              src="https://cdn.pixabay.com/photo/2023/10/16/06/10/website-8318520_1280.png"
              alt="Logo"
              style={{ width: 32, height: 32 }}
            />
        ),
        title: 'Admin Panel',
      }}
    >
      <DashboardLayout>
        <Box>
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
