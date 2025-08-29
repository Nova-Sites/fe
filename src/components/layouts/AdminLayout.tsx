import Box from '@mui/material/Box';
//
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
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
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathnameRelativeToAdmin = React.useMemo(() => {
    if (location.pathname.startsWith('/admin')) {
      const rest = location.pathname.slice('/admin'.length);
      return rest.length === 0 ? '/' : rest;
    }
    return location.pathname;
  }, [location.pathname]);

  const router = React.useMemo(
    () => ({
      pathname: pathnameRelativeToAdmin,
      searchParams: new URLSearchParams(location.search),
      navigate: (path: string) => {
        const normalized = path === '' || path === '/' ? '/admin' : path;
        const resolved = normalized.startsWith('/admin')
          ? normalized
          : `/admin${normalized.startsWith('/') ? '' : '/'}${normalized}`;
        navigate(resolved);
      },
    }) as any,
    [navigate, pathnameRelativeToAdmin, location.search],
  );

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout>
        <Box
          sx={{
            py: 4,
            px: 2,
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
