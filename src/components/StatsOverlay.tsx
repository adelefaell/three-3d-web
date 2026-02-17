import { useViewerStore } from '../store/viewerStore'
import { useEffect, useState } from 'react'

/** FPS counter using requestAnimationFrame — runs in DOM, no R3F dependency */
function useFPS(enabled: boolean) {
  const [fps, setFps] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let frameCount = 0
    let lastTime = performance.now()
    let rafId: number
    const tick = () => {
      rafId = requestAnimationFrame(tick)
      frameCount += 1
      const now = performance.now()
      const elapsed = now - lastTime
      if (elapsed >= 1000) {
        setFps(Math.round((frameCount * 1000) / elapsed))
        frameCount = 0
        lastTime = now
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [enabled])
  return fps
}

/** Stats overlay: FPS when toggled from viewer store */
export function StatsOverlay() {
  const show = useViewerStore((s) => s.showStats)
  const fps = useFPS(show)
  if (!show) return null
  return (
    <div className="stats-overlay" role="status" aria-live="polite">
      <span>FPS: {fps}</span>
    </div>
  )
}
