import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  accessToken: string | null;
  sidebarOpen: boolean;
  setAccessToken: (token: string | null) => void;
  toggleSidebar: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      accessToken: null,
      sidebarOpen: true,
      setAccessToken: (accessToken) => set({ accessToken }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'spike-admin-store', partialize: (state) => ({ accessToken: state.accessToken }) },
  ),
);
