import { describe, it, expect, beforeEach } from 'vitest'
import { useViewerStore } from './viewerStore'

describe('viewerStore', () => {
  beforeEach(() => {
    useViewerStore.setState({
      cameraPreset: 'free',
      materialType: 'standard',
      selectedColor: '#888888',
      wireframe: false,
    })
  })

  it('updates camera preset', () => {
    useViewerStore.getState().setCameraPreset('top')
    expect(useViewerStore.getState().cameraPreset).toBe('top')
  })

  it('updates material type', () => {
    useViewerStore.getState().setMaterialType('physical')
    expect(useViewerStore.getState().materialType).toBe('physical')
  })

  it('updates selected color', () => {
    useViewerStore.getState().setSelectedColor('#ff0000')
    expect(useViewerStore.getState().selectedColor).toBe('#ff0000')
  })

  it('toggles wireframe', () => {
    useViewerStore.getState().setWireframe(true)
    expect(useViewerStore.getState().wireframe).toBe(true)
  })
})
