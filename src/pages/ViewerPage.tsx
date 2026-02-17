import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { SceneRoot } from '../scene/SceneRoot'
import { ViewerControls } from '../components/ViewerControls'
import { LoaderOverlay } from '../components/LoaderOverlay'
import { StatsOverlay } from '../components/StatsOverlay'
import { useLoaderStore } from '../store/loaderStore'

/** Main 3D product viewer page: canvas + side panel + loading/stats overlays */
export function ViewerPage() {
  const loading = useLoaderStore((s) => s.loading)
  const progress = useLoaderStore((s) => s.progress)
  const error = useLoaderStore((s) => s.error)
  const setLoading = useLoaderStore((s) => s.setLoading)

  useEffect(() => {
    setLoading(true)
  }, [setLoading])

  return (
    <div className="viewer-page">
      <div className="viewer-canvas-wrap" aria-label="3D product viewer">
        <Suspense fallback={<LoaderOverlay progress={0} />}>
          <Canvas
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              stencil: true,
              depth: true,
            }}
            dpr={Math.min(window.devicePixelRatio, 2)}
            shadows
            camera={{ position: [4, 2, 4], fov: 45, near: 0.1, far: 1000 }}
            onCreated={({ gl }) => {
              
              gl.setClearColor('#252530')
              gl.shadowMap.enabled = true
              gl.localClippingEnabled = true
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 1.15
              gl.outputColorSpace = 'srgb'
            }}
            resize={{ scroll: false, debounce: { scroll: 0, resize: 100 } }}
          >
            <SceneRoot />
          </Canvas>
        </Suspense>
        {loading && <LoaderOverlay progress={progress} />}
        {error != null && !loading && <LoaderOverlay progress={100} error={error} />}
        <StatsOverlay />
      </div>
      <aside className="viewer-panel" aria-label="Viewer controls">
        <ViewerControls />
      </aside>
    </div>
  )
}
