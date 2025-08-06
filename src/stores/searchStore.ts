import { create } from 'zustand'

interface SearchState {
  searchQuery: string
  debouncedSearchQuery: string
  setSearchQuery: (query: string) => void
  setDebouncedSearchQuery: (query: string) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  debouncedSearchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setDebouncedSearchQuery: (query: string) =>
    set({ debouncedSearchQuery: query }),
  clearSearch: () => set({ searchQuery: '', debouncedSearchQuery: '' }),
}))
