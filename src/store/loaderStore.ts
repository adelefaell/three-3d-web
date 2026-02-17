import { create } from 'zustand'

/** Global loader state for GLB/assets — drives progress bar and error fallback */
export interface LoaderState {
  loading: boolean
  progress: number
  error: string | null
  setLoading: (loading: boolean) => void
  setProgress: (progress: number) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useLoaderStore = create<LoaderState>((set) => ({
  loading: false,
  progress: 0,
  error: null,
  setLoading: (loading) => set({ loading }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  reset: () => set({ loading: false, progress: 0, error: null }),
}))
