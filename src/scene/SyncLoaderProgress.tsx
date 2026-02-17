import { useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { useLoaderStore } from '../store/loaderStore'

/** Syncs Drei's useProgress (Three.js DefaultLoadingManager) to our global loader store for the progress bar */
export function SyncLoaderProgress() {
  const { active, progress, errors } = useProgress()
  const setLoading = useLoaderStore((s) => s.setLoading)
  const setProgress = useLoaderStore((s) => s.setProgress)
  const setError = useLoaderStore((s) => s.setError)

  useEffect(() => {
    setLoading(active)
    setProgress(progress)
    if (errors.length > 0) setError(errors[errors.length - 1])
    else if (!active) setError(null)
  }, [active, progress, errors, setLoading, setProgress, setError])

  return null
}
