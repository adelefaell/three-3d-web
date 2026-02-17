import { useRef, useMemo, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { type ThreeEvent } from '@react-three/fiber'
import { useViewerStore, type MaterialType } from '../store/viewerStore'
import * as THREE from 'three'

const DEFAULT_MODEL_URL = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf'
/** Lower-poly model for manual compare (not THREE.LOD distance-based switching) */
const LOW_POLY_MODEL_URL = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Parrot.glb'

/** Six planes forming a box (center ± radius). With clipIntersection = true, only geometry inside the box is shown. */
function makeClipBoxPlanes(cx: number, cy: number, cz: number, radius: number): THREE.Plane[] {
  const r = Math.max(0.01, radius)
  return [
    new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(1, 0, 0), new THREE.Vector3(cx - r, cy, cz)),
    new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(cx + r, cy, cz)),
    new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), new THREE.Vector3(cx, cy - r, cz)),
    new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, -1, 0), new THREE.Vector3(cx, cy + r, cz)),
    new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(cx, cy, cz - r)),
    new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, -1), new THREE.Vector3(cx, cy, cz + r)),
  ]
}

function applyMaterialToMesh(
  mesh: THREE.Mesh,
  opts: {
    color: string
    wireframe: boolean
    materialType: 'standard' | 'physical'
    clipPlanes: THREE.Plane[] | null
  },
) {
  const base = mesh.material as THREE.MeshStandardMaterial
  const isPhysical = opts.materialType === 'physical'
  const Material = isPhysical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial

  const baseProps = {
    color: opts.color,
    metalness: base?.metalness ?? 0.5,
    roughness: base?.roughness ?? 0.5,
    wireframe: opts.wireframe,
  }

  const mat = isPhysical
    ? new THREE.MeshPhysicalMaterial({
        ...baseProps,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        reflectivity: 0.5,
      })
    : new Material(baseProps)

  if (opts.clipPlanes != null && opts.clipPlanes.length > 0) {
    mat.clippingPlanes = opts.clipPlanes
    mat.clipShadows = true
    mat.clipIntersection = true
  }
  mesh.material = mat
}

/** Placeholder when model fails to load — used as ErrorBoundary fallback */
export function FallbackModel() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireframe = useViewerStore((s) => s.wireframe)
  const color = useViewerStore((s) => s.selectedColor)
  const materialType = useViewerStore((s) => s.materialType)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2
  })

  const Material = materialType === 'physical' ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial
  const mat = useMemo(() => new Material({ color, wireframe }), [color, wireframe, materialType])

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/** Loaded GLB: applies store-driven material overrides and subtle rotation */
function LoadedModel({
  url,
  color,
  wireframe,
  materialType,
  clipBySphere,
  clipSphereCenterX,
  clipSphereCenterY,
  clipSphereCenterZ,
  clipSphereRadius,
}: {
  url: string
  color: string
  wireframe: boolean
  materialType: MaterialType
  clipBySphere: boolean
  clipSphereCenterX: number
  clipSphereCenterY: number
  clipSphereCenterZ: number
  clipSphereRadius: number
}) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)
  const { camera, controls } = useThree()
  // Rebuild clone whenever material state changes; key on primitive forces R3F to apply new object
  const cloned = useMemo(() => {
    const s = scene.clone()
    const clipPlanes =
      clipBySphere
        ? makeClipBoxPlanes(clipSphereCenterX, clipSphereCenterY, clipSphereCenterZ, clipSphereRadius)
        : null

    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        applyMaterialToMesh(child as THREE.Mesh, {
          color,
          wireframe,
          materialType,
          clipPlanes,
        })
      }
    })
    return s
  }, [
    scene,
    color,
    wireframe,
    materialType,
    clipBySphere,
    clipSphereCenterX,
    clipSphereCenterY,
    clipSphereCenterZ,
    clipSphereRadius,
  ])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.15
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const obj = e.object
    if (!obj || !controls) return
    const box = new THREE.Box3().setFromObject(obj)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    ;(controls as unknown as { target: THREE.Vector3 }).target.copy(center)
    const dir = new THREE.Vector3().subVectors(camera.position, center).normalize()
    const cam = camera as THREE.PerspectiveCamera
    cam.position.copy(center.clone().add(dir.multiplyScalar(Math.max(maxDim * 2, 4))))
  }

  const primitiveKey = `${color}-${wireframe}-${materialType}-${clipBySphere}-${clipSphereCenterX}-${clipSphereCenterY}-${clipSphereCenterZ}-${clipSphereRadius}`

  return (
    <group ref={groupRef}>
      <primitive
        key={primitiveKey}
        object={cloned}
        castShadow
        receiveShadow
        onClick={handleClick}
      />
    </group>
  )
}

/** Model root: reads material state and useLOD (manual high/low-poly swap, not THREE.LOD). Passes props to LoadedModel. */
export function Model() {
  const useLOD = useViewerStore((s) => s.useLOD)
  const url = useLOD ? LOW_POLY_MODEL_URL : DEFAULT_MODEL_URL
  const color = useViewerStore((s) => s.selectedColor)
  const wireframe = useViewerStore((s) => s.wireframe)
  const materialType = useViewerStore((s) => s.materialType)
  const clipBySphere = useViewerStore((s) => s.clipBySphere)
  const clipSphereCenterX = useViewerStore((s) => s.clipSphereCenterX)
  const clipSphereCenterY = useViewerStore((s) => s.clipSphereCenterY)
  const clipSphereCenterZ = useViewerStore((s) => s.clipSphereCenterZ)
  const clipSphereRadius = useViewerStore((s) => s.clipSphereRadius)

  return (
    <Suspense fallback={null}>
      <LoadedModel
        url={url}
        color={color}
        wireframe={wireframe}
        materialType={materialType}
        clipBySphere={clipBySphere}
        clipSphereCenterX={clipSphereCenterX}
        clipSphereCenterY={clipSphereCenterY}
        clipSphereCenterZ={clipSphereCenterZ}
        clipSphereRadius={clipSphereRadius}
      />
    </Suspense>
  )
}
