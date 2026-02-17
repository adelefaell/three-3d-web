import { useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Model, FallbackModel } from './Model'
import { Lights } from './Lights'
import { Ground } from './Ground'
import { CameraPresets } from './CameraPresets'
import { SyncLoaderProgress } from './SyncLoaderProgress'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useViewerStore } from '../store/viewerStore'

/** Wireframe sphere showing the clip boundary when clipping is enabled */
function ClipSphereWireframe() {
  const enabled = useViewerStore((s) => s.clipBySphere)
  const cx = useViewerStore((s) => s.clipSphereCenterX)
  const cy = useViewerStore((s) => s.clipSphereCenterY)
  const cz = useViewerStore((s) => s.clipSphereCenterZ)
  const radius = useViewerStore((s) => s.clipSphereRadius)
  if (!enabled) return null
  return (
    <mesh position={[cx, cy, cz]} renderOrder={1}>
      <sphereGeometry args={[Math.max(0.01, radius), 24, 24]} />
      <meshBasicMaterial
        color="#4080ff"
        wireframe
        depthTest={false}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

/** Clears global clipping planes when clipping is disabled (per-material clipping is used; this avoids stale state) */
function ClippingCleanup() {
  const clipBySphere = useViewerStore((s) => s.clipBySphere)
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    if (!clipBySphere) gl.clippingPlanes = []
  }, [clipBySphere, gl])
  useEffect(() => () => {
    gl.clippingPlanes = []
  }, [gl])
  return null
}

/** Scene graph: camera controls, lights, ground, model. DPR/resize handled by Canvas in ViewerPage. */
export function SceneRoot() {
  return (
    <>
      <SyncLoaderProgress />
      <ClippingCleanup />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={20}
      />
      <CameraPresets />
      <Lights />
      <Ground />
      <ErrorBoundary fallback={<FallbackModel />}>
        <Model />
      </ErrorBoundary>
      <ClipSphereWireframe />
    </>
  )
}
