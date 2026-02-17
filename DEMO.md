# Demo script (30–90 seconds)

Use this as a short interview walkthrough.

1. **Open the app** — Show loading progress, then the loaded 3D model (e.g. Damaged Helmet).
2. **Material** — Toggle a **color swatch** and **Standard vs Physical**; mention metalness/roughness and PBR.
3. **Lighting** — Move the **ambient** and **directional** sliders; briefly say how directional vs ambient affects the look.
4. **Compare LOD** — Turn on **Compare LOD** to load a different (e.g. lower-poly) model; point at the **FPS** counter if visible.
5. **Network** — Open DevTools → Network: show the GLB (or assets) loading and caching.
6. **Tests & code** — Mention tests (if added), monitoring, and where the main logic lives (scene, store, API).

## Talking points

- “The scene is rendered in a single WebGL context managed by React Three Fiber; the React tree keeps the 3D graph predictable.”
- “I clamped devicePixelRatio and used optional LOD to keep performance and bandwidth in check.”
- “Material and lighting changes are driven by Zustand; loader state is synced from Three’s DefaultLoadingManager for the progress bar.”
- “Failed loads are caught by an ErrorBoundary and we show a fallback placeholder so the viewer still works.”
