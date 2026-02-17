import { useViewerStore } from '../store/viewerStore'

/** Ambient + directional (with shadow) + point light; all driven by Zustand */
export function Lights() {
  const ambientIntensity = useViewerStore((s) => s.ambientIntensity)
  const directionalIntensity = useViewerStore((s) => s.directionalIntensity)
  const directionalColor = useViewerStore((s) => s.directionalColor)
  const pointLightIntensity = useViewerStore((s) => s.pointLightIntensity)

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={directionalIntensity}
        color={directionalColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-4, 4, 4]} intensity={pointLightIntensity} />
    </>
  )
}
