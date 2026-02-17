import { useLoaderStore } from '../store/loaderStore'

interface LoaderOverlayProps {
  progress: number
  error?: string | null
}

/** Full-screen overlay with progress bar while assets load; shows error message on failure */
export function LoaderOverlay({ progress, error }: LoaderOverlayProps) {
  const setError = useLoaderStore((s) => s.setError)

  if (error) {
    return (
      <div className="loader-overlay" role="status" aria-live="polite">
        <div className="loader-box">
          <p className="loader-error">{error}</p>
          <p>Using fallback placeholder.</p>
          <button type="button" onClick={() => setError(null)}>
            Continue
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="loader-overlay" role="status" aria-live="polite" aria-label={`Loading ${Math.round(progress)}%`}>
      <div className="loader-box">
        <div className="loader-bar-wrap">
          <div className="loader-bar" style={{ width: `${progress}%` }} />
        </div>
        <p>{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
