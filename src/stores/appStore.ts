import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'pt' | 'en'
type Theme = 'light' | 'dark'

interface AppState {
  // Language
  language: Language
  setLanguage: (language: Language) => void

  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Error handling
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Language
      language: 'pt',
      setLanguage: (language) => set({ language }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Error handling
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    },
  ),
)
