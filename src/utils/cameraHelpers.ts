/**
 * Camera math helpers — used for click-to-focus and preset positioning.
 * Pure functions for easy unit testing.
 */

/** Distance needed so an object of size `size` fits in view for a given FOV (radians) and aspect ratio */
export function distanceForSize(size: number, fovRad: number, aspect: number): number {
  const fovHalf = fovRad / 2
  const v = Math.tan(fovHalf) * (aspect >= 1 ? 1 / aspect : aspect)
  return (size / 2) / Math.tan(Math.atan(v))
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
