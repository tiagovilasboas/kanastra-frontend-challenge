import { create } from 'zustand'

import { fetchCounterValue } from '../api/counterApi'

interface CounterState {
  value: number
  loading: boolean
  fetchValue: () => Promise<void>
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  value: 0,
  loading: false,
  fetchValue: async () => {
    set({ loading: true })
    const value = await fetchCounterValue()
    set({ value, loading: false })
  },
  increment: () => set((state) => ({ value: state.value + 1 })),
  decrement: () => set((state) => ({ value: state.value - 1 })),
})) 