import { describe, it, expect } from 'vitest'
import { distanceForSize, clamp } from './cameraHelpers'

describe('cameraHelpers', () => {
  describe('distanceForSize', () => {
    it('returns positive distance for positive size and fov', () => {
      const d = distanceForSize(2, Math.PI / 4, 16 / 9)
      expect(d).toBeGreaterThan(0)
      expect(Number.isFinite(d)).toBe(true)
    })

    it('increases distance when size increases', () => {
      const d1 = distanceForSize(1, Math.PI / 4, 1)
      const d2 = distanceForSize(2, Math.PI / 4, 1)
      expect(d2).toBeGreaterThan(d1)
    })
  })

  describe('clamp', () => {
    it('returns value when within range', () => {
      expect(clamp(0.5, 0, 1)).toBe(0.5)
    })

    it('returns min when value is below min', () => {
      expect(clamp(-1, 0, 1)).toBe(0)
    })

    it('returns max when value is above max', () => {
      expect(clamp(2, 0, 1)).toBe(1)
    })
  })
})
