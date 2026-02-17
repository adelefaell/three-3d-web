import { create } from 'zustand'

/** Camera preset identifiers for quick view switching */
export type CameraPreset = 'free' | 'top' | 'front' | 'isometric'

/** Material type for PBR toggling */
export type MaterialType = 'standard' | 'physical'

/** UI and 3D viewer state — kept in Zustand for predictable updates without re-rendering the canvas */
export interface ViewerState {
  // Camera
  cameraPreset: CameraPreset
  setCameraPreset: (preset: CameraPreset) => void

  // Material
  materialType: MaterialType
  setMaterialType: (type: MaterialType) => void
  selectedColor: string
  setSelectedColor: (color: string) => void
  wireframe: boolean
  setWireframe: (v: boolean) => void

  // Lighting (normalized 0–1 or hex)
  ambientIntensity: number
  setAmbientIntensity: (v: number) => void
  directionalIntensity: number
  setDirectionalIntensity: (v: number) => void
  pointLightIntensity: number
  setPointLightIntensity: (v: number) => void
  directionalColor: string
  setDirectionalColor: (c: string) => void

  // Clipping sphere (toggle + box from 6 planes, clipIntersection = true)
  clipBySphere: boolean
  setClipBySphere: (v: boolean) => void
  toggleClipping: () => void
  clipSphereCenterX: number
  clipSphereCenterY: number
  clipSphereCenterZ: number
  clipSphereRadius: number
  setClipSphereCenter: (x: number, y: number, z: number) => void
  setClipSphereRadius: (r: number) => void

  // Ground plane (shadow receiver)
  groundVisible: boolean
  setGroundVisible: (v: boolean) => void
  toggleGround: () => void

  // Debug / compare
  showStats: boolean
  setShowStats: (v: boolean) => void
  useLOD: boolean
  setUseLOD: (v: boolean) => void
}

export const useViewerStore = create<ViewerState>((set) => ({
  cameraPreset: 'free',
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),

  materialType: 'standard',
  setMaterialType: (materialType) => set({ materialType }),
  selectedColor: '#b0b0b0',
  setSelectedColor: (selectedColor) => set({ selectedColor }),
  wireframe: false,
  setWireframe: (wireframe) => set({ wireframe }),

  ambientIntensity: 0.65,
  setAmbientIntensity: (ambientIntensity) => set({ ambientIntensity }),
  directionalIntensity: 1.6,
  setDirectionalIntensity: (directionalIntensity) => set({ directionalIntensity }),
  pointLightIntensity: 0.9,
  setPointLightIntensity: (pointLightIntensity) => set({ pointLightIntensity }),
  directionalColor: '#ffffff',
  setDirectionalColor: (directionalColor) => set({ directionalColor }),

  clipBySphere: false,
  setClipBySphere: (clipBySphere) => set({ clipBySphere }),
  toggleClipping: () => set((s) => ({ clipBySphere: !s.clipBySphere })),
  clipSphereCenterX: 0,
  clipSphereCenterY: 0,
  clipSphereCenterZ: 0,
  clipSphereRadius: 1,
  setClipSphereCenter: (x, y, z) =>
    set({ clipSphereCenterX: x, clipSphereCenterY: y, clipSphereCenterZ: z }),
  setClipSphereRadius: (r) => set({ clipSphereRadius: r }),

  groundVisible: true,
  setGroundVisible: (groundVisible) => set({ groundVisible }),
  toggleGround: () => set((s) => ({ groundVisible: !s.groundVisible })),

  showStats: false,
  setShowStats: (showStats) => set({ showStats }),
  useLOD: false,
  setUseLOD: (useLOD) => set({ useLOD }),
}))
