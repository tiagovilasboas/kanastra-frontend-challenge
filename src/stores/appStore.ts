import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  language: string
  theme: 'light' | 'dark'
  isLoading: boolean
  error: string | null
}

interface AppActions {
  setLanguage: (language: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      language: 'pt',
      theme: 'dark',
      isLoading: false,
      error: null,

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'app-store',
    }
  )
)
