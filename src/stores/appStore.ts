import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  language: string
  theme: 'light' | 'dark'
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  isAuthenticated: boolean
}

interface AppActions {
  setLanguage: (language: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setInitialized: (initialized: boolean) => void
  setAuthenticated: (authenticated: boolean) => void
  initialize: () => Promise<void>
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      language: 'pt',
      theme: 'dark',
      isLoading: false,
      error: null,
      isInitialized: false,
      isAuthenticated: false,

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      initialize: async () => {
        const { setLoading, setError, setInitialized, setAuthenticated } = get()

        setLoading(true)
        setError(null)

        try {
          // Check authentication using a more controlled approach
          let token: string | null = null
          try {
            token = localStorage.getItem('spotify_token')
          } catch (error) {
            console.error('Error accessing localStorage:', error)
          }

          setAuthenticated(!!token)

          // Mark as initialized
          setInitialized(true)
        } catch (error) {
          setError(
            error instanceof Error ? error.message : 'Initialization failed',
          )
        } finally {
          setLoading(false)
        }
      },
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
