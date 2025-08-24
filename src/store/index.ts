import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/services/auth.api';
import { categoryApi } from '@/services/category.api';
import { productApi } from '@/services/product.api';
import { userApi } from '@/services/user.api';
import { uploadApi } from '@/services/upload.api';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    
    // Regular reducers
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      authApi.middleware,
      categoryApi.middleware,
      productApi.middleware,
      userApi.middleware,
      uploadApi.middleware
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
