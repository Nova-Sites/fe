// Import routes from separate files
export { publicRoutes } from './public.routes';
export { authRoutes } from './auth.routes';
export { userRoutes } from './user.routes';
export { adminRoutes } from './admin.routes';

// Re-export all routes for convenience
import { publicRoutes } from './public.routes';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { adminRoutes } from './admin.routes';

// All routes combined
export const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
];

export default routes;
