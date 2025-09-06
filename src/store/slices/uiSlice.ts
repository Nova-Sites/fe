import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { THEME, STORAGE_KEYS } from '@/constants';

interface UiState {
  theme: typeof THEME.LIGHT | typeof THEME.DARK;
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
}

const initialState: UiState = {
  theme:
    (localStorage.getItem(STORAGE_KEYS.THEME) as
      | typeof THEME.LIGHT
      | typeof THEME.DARK) || THEME.LIGHT,
  sidebarOpen: false,
  loading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
    },
    setTheme: (
      state,
      action: PayloadAction<typeof THEME.LIGHT | typeof THEME.DARK>
    ) => {
      state.theme = action.payload;
      localStorage.setItem(STORAGE_KEYS.THEME, action.payload);
    },
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<UiState['notifications'][0], 'id'>>
    ) => {
      const id = Date.now().toString();
      state.notifications.push({ ...action.payload, id });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    clearNotifications: state => {
      state.notifications = [];
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
