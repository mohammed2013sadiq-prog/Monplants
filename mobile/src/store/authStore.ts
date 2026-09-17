import { create } from 'zustand';
import api from '../services/api';
import { storage } from '../utils/storage';
import { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });
      const { user, token } = response.data.data;

      await storage.saveToken(token);
      await storage.saveUser(user);

      set({ user, token, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      let message = err.response?.data?.message;
      if (!message) {
        if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
          message = 'Cannot connect to MoPlants server. Ensure the backend is running.';
        } else {
          message = err.message || 'Login failed. Please check your credentials.';
        }
      }
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (full_name, email, password, avatar) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', {
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        password,
        ...(avatar ? { avatar } : {})
      });
      const { user, token } = response.data.data;

      await storage.saveToken(token);
      await storage.saveUser(user);

      set({ user, token, isLoading: false, error: null });
      return true;
    } catch (err: any) {
      let message = err.response?.data?.message;
      if (!message) {
        if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
          message = 'Cannot connect to MoPlants server. Ensure the backend is running.';
        } else {
          message = err.message || 'Registration failed.';
        }
      }
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await storage.clearAll();
    set({ user: null, token: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await storage.getToken();
      const cachedUser = await storage.getUser();

      if (token && cachedUser) {
        set({ user: cachedUser, token, isLoading: false });

        // Verify with backend
        try {
          const res = await api.get('/auth/profile');
          if (res.data?.data) {
            set({ user: res.data.data });
            await storage.saveUser(res.data.data);
          }
        } catch {
          // Keep cached user if offline
        }
      } else {
        set({ user: null, token: null, isLoading: false });
      }
    } catch (e) {
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateAvatar: async (avatar: string | null) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, avatar: avatar || undefined };
      set({ user: updatedUser });
      await storage.saveUser(updatedUser);

      // Sync avatar to database
      try {
        await api.put('/auth/profile', { avatar: avatar || null });
      } catch (err) {
        console.warn('Could not sync avatar to backend database:', err);
      }
    } else {
      const defaultUser = {
        id: 1,
        full_name: 'Botanical Explorer',
        email: 'explorer@moplants.app',
        avatar: avatar || undefined
      };
      set({ user: defaultUser });
      await storage.saveUser(defaultUser);
    }
  }
}));
