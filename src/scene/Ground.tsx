import { useRef } from 'react'
import { type Mesh } from 'three'
import { useViewerStore } from '../store/viewerStore'

/** Ground plane receiving shadows; visibility and material driven by store */
export function Ground() {
  const meshRef = useRef<Mesh>(null)
  const groundVisible = useViewerStore((s) => s.groundVisible)
  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      visible={groundVisible}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#3a3a42"
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}
