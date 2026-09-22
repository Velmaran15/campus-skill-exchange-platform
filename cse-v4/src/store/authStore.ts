import { create } from 'zustand';
import type { User } from '../types';

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem('cse_token') || null,

  user: (() => {
    try {
      const u = localStorage.getItem('cse_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),

  setAuth: (token, user) => {
    localStorage.setItem('cse_token', token);
    localStorage.setItem('cse_user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('cse_token');
    localStorage.removeItem('cse_user');
    set({ token: null, user: null });
  },

  isAuthenticated: () => !!get().token,
}));
