import { useViewerStore, type CameraPreset, type MaterialType } from '../store/viewerStore'
import { useProductQuery } from '../api/productApi'

const PRESETS: { value: CameraPreset; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'top', label: 'Top' },
  { value: 'front', label: 'Front' },
  { value: 'isometric', label: 'Isometric' },
]

const MATERIAL_TYPES: { value: MaterialType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'physical', label: 'Physical' },
]

const SWATCH_COLORS = ['#b0b0b0', '#c0a060', '#4060a0', '#a04040', '#40a060']

/** Side panel: camera presets, material type, color swatches, light sliders, debug toggles */
export function ViewerControls() {
  const cameraPreset = useViewerStore((s) => s.cameraPreset)
  const setCameraPreset = useViewerStore((s) => s.setCameraPreset)
  const materialType = useViewerStore((s) => s.materialType)
  const setMaterialType = useViewerStore((s) => s.setMaterialType)
  const selectedColor = useViewerStore((s) => s.selectedColor)
  const setSelectedColor = useViewerStore((s) => s.setSelectedColor)
  const wireframe = useViewerStore((s) => s.wireframe)
  const setWireframe = useViewerStore((s) => s.setWireframe)
  const ambientIntensity = useViewerStore((s) => s.ambientIntensity)
  const setAmbientIntensity = useViewerStore((s) => s.setAmbientIntensity)
  const directionalIntensity = useViewerStore((s) => s.directionalIntensity)
  const setDirectionalIntensity = useViewerStore((s) => s.setDirectionalIntensity)
  const pointLightIntensity = useViewerStore((s) => s.pointLightIntensity)
  const setPointLightIntensity = useViewerStore((s) => s.setPointLightIntensity)
  const directionalColor = useViewerStore((s) => s.directionalColor)
  const setDirectionalColor = useViewerStore((s) => s.setDirectionalColor)
  const showStats = useViewerStore((s) => s.showStats)
  const setShowStats = useViewerStore((s) => s.setShowStats)
  const useLOD = useViewerStore((s) => s.useLOD)
  const setUseLOD = useViewerStore((s) => s.setUseLOD)
  const clipBySphere = useViewerStore((s) => s.clipBySphere)
  const setClipBySphere = useViewerStore((s) => s.setClipBySphere)
  const clipSphereCenterX = useViewerStore((s) => s.clipSphereCenterX)
  const clipSphereCenterY = useViewerStore((s) => s.clipSphereCenterY)
  const clipSphereCenterZ = useViewerStore((s) => s.clipSphereCenterZ)
  const clipSphereRadius = useViewerStore((s) => s.clipSphereRadius)
  const setClipSphereCenter = useViewerStore((s) => s.setClipSphereCenter)
  const setClipSphereRadius = useViewerStore((s) => s.setClipSphereRadius)
  const groundVisible = useViewerStore((s) => s.groundVisible)
  const setGroundVisible = useViewerStore((s) => s.setGroundVisible)

  const { data: product, status } = useProductQuery('1')

  return (
    <div className="viewer-controls">
      <h2 id="viewer-controls-heading">Controls</h2>

      <section aria-labelledby="camera-presets-heading">
        <h3 id="camera-presets-heading">Camera</h3>
        <div className="control-group" role="group" aria-label="Camera presets">
          {PRESETS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={cameraPreset === value}
              onClick={() => setCameraPreset(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="material-heading">
        <h3 id="material-heading">Material</h3>
        <div className="control-group" role="group" aria-label="Material type">
          {MATERIAL_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={materialType === value}
              onClick={() => setMaterialType(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="control-label">Color</p>
        <div className="swatches" role="group" aria-label="Color swatches">
          {SWATCH_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className="swatch"
              style={{ backgroundColor: color }}
              aria-label={`Set color ${color}`}
              aria-pressed={selectedColor === color}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        <label className="control-toggle">
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
            aria-label="Toggle wireframe"
          />
          Wireframe
        </label>
        <label className="control-toggle">
          <input
            type="checkbox"
            checked={clipBySphere}
            onChange={(e) => setClipBySphere(e.target.checked)}
            aria-label="Clip model with sphere (show inside box)"
          />
          Sphere cut
        </label>
        {clipBySphere && (
          <>
            <p className="control-label">Clip sphere center</p>
            <label className="control-slider">
              <span>X</span>
              <input
                type="range"
                min={-2}
                max={2}
                step={0.1}
                value={clipSphereCenterX}
                onChange={(e) =>
                  setClipSphereCenter(Number(e.target.value), clipSphereCenterY, clipSphereCenterZ)
                }
              />
            </label>
            <label className="control-slider">
              <span>Y</span>
              <input
                type="range"
                min={-2}
                max={2}
                step={0.1}
                value={clipSphereCenterY}
                onChange={(e) =>
                  setClipSphereCenter(clipSphereCenterX, Number(e.target.value), clipSphereCenterZ)
                }
              />
            </label>
            <label className="control-slider">
              <span>Z</span>
              <input
                type="range"
                min={-2}
                max={2}
                step={0.1}
                value={clipSphereCenterZ}
                onChange={(e) =>
                  setClipSphereCenter(clipSphereCenterX, clipSphereCenterY, Number(e.target.value))
                }
              />
            </label>
            <label className="control-slider">
              <span>Radius</span>
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.1}
                value={clipSphereRadius}
                onChange={(e) => setClipSphereRadius(Number(e.target.value))}
              />
            </label>
          </>
        )}
      </section>

      <section aria-labelledby="lighting-heading">
        <h3 id="lighting-heading">Lighting</h3>
        <label className="control-slider">
          <span>Ambient</span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={ambientIntensity}
            onChange={(e) => setAmbientIntensity(Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={2}
            aria-valuenow={ambientIntensity}
          />
        </label>
        <label className="control-slider">
          <span>Directional</span>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={directionalIntensity}
            onChange={(e) => setDirectionalIntensity(Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={directionalIntensity}
          />
        </label>
        <label className="control-slider">
          <span>Point light</span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={pointLightIntensity}
            onChange={(e) => setPointLightIntensity(Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={2}
            aria-valuenow={pointLightIntensity}
          />
        </label>
        <label className="control-color">
          <span>Directional color</span>
          <input
            type="color"
            value={directionalColor}
            onChange={(e) => setDirectionalColor(e.target.value)}
            aria-label="Directional light color"
          />
        </label>
      </section>

      <section aria-labelledby="scene-heading">
        <h3 id="scene-heading">Scene</h3>
        <label className="control-toggle">
          <input
            type="checkbox"
            checked={groundVisible}
            onChange={(e) => setGroundVisible(e.target.checked)}
            aria-label="Show ground plane"
          />
          Ground plane
        </label>
      </section>

      <section aria-labelledby="debug-heading">
        <h3 id="debug-heading">Debug</h3>
        <label className="control-toggle">
          <input
            type="checkbox"
            checked={showStats}
            onChange={(e) => setShowStats(e.target.checked)}
            aria-label="Show FPS and stats"
          />
          Show FPS
        </label>
        <label className="control-toggle">
          <input
            type="checkbox"
            checked={useLOD}
            onChange={(e) => setUseLOD(e.target.checked)}
            aria-label="Use low-poly model (compare)"
          />
          Low-poly model
        </label>
      </section>

      {product != null && (
        <section aria-label="Product metadata">
          <h3>Product</h3>
          <p>{product.name}</p>
          <p className="meta-status">API: {status}</p>
        </section>
      )}
    </div>
  )
}
