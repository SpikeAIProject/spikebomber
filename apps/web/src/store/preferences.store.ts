import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  selectedModel: string;
  theme: 'dark' | 'light' | 'system';
  language: string;
  setModel: (model: string) => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      selectedModel: 'gemini-1.5-flash',
      theme: 'dark',
      language: 'pt-BR',
      setModel: (model) => set({ selectedModel: model }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'spike-ai-preferences' },
  ),
);
