import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useViewerStore } from '../store/viewerStore'
import * as THREE from 'three'

const PRESET_POSITIONS: Record<string, [number, number, number]> = {
  free: [4, 2, 4],
  top: [0, 8, 0.01],
  front: [0, 2, 8],
  isometric: [5, 5, 5],
}

/** Listens to cameraPreset from store and tweens camera position only for fixed presets (not "free"). */
export function CameraPresets() {
  const { camera } = useThree()
  const preset = useViewerStore((s) => s.cameraPreset)
  const target = useRef(new THREE.Vector3())
  const isAnimating = useRef(false)

  useEffect(() => {
    if (preset === 'free') {
      isAnimating.current = false
      return
    }
    const pos = PRESET_POSITIONS[preset]
    if (pos) {
      target.current.set(...pos)
      isAnimating.current = true
    }
  }, [preset])

  useEffect(() => {
    if (preset === 'free' || !isAnimating.current) return
    const cam = camera as THREE.PerspectiveCamera
    const step = () => {
      cam.position.lerp(target.current, 0.05)
      if (cam.position.distanceTo(target.current) < 0.01) {
        cam.position.copy(target.current)
        isAnimating.current = false
      }
    }
    const id = setInterval(step, 16)
    return () => clearInterval(id)
  }, [preset, camera])

  return null
}
