import { create } from 'zustand'

// Removed unused logger import

type NavigationSection = 'home' | 'library' | 'create'

interface NavigationState {
  activeSection: NavigationSection
  setActiveSection: (section: NavigationSection) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'home',

  setActiveSection: (section: NavigationSection) => {
    // Removed debug logs for cleaner production code
    set({ activeSection: section })

    // Navigate to home page when changing sections
    if (section !== 'home') {
      const url = `/?section=${section}`
      window.history.pushState({}, '', url)
    } else {
      window.history.pushState({}, '', '/')
    }
  },
}))
