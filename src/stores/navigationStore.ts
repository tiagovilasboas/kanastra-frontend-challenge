import { create } from 'zustand'

import { logger } from '@/utils/logger'

type NavigationSection = 'home' | 'library' | 'create'

interface NavigationState {
  activeSection: NavigationSection
  setActiveSection: (section: NavigationSection) => void
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  activeSection: 'home',

  setActiveSection: (section: NavigationSection) => {
    logger.debug('Navigation section changed', {
      from: get().activeSection,
      to: section,
    })
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
