import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface Subscription {
  plan: { name: string; tier: string };
  status: string;
  tokensUsed: number;
  requestsUsed: number;
  currentPeriodEnd: string;
}

interface AppState {
  user: User | null;
  subscription: Subscription | null;
  accessToken: string | null;
  refreshToken: string | null;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';

  setUser: (user: User | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      subscription: null,
      accessToken: null,
      refreshToken: null,
      sidebarOpen: true,
      theme: 'dark',

      setUser: (user) => set({ user }),
      setSubscription: (subscription) => set({ subscription }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null, user: null }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'spike-ai-store',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        theme: state.theme,
      }),
    },
  ),
);
