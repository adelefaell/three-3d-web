# 3D Product Viewer

A responsive single-page app to load and inspect 3D products (GLB/GLTF). Built as an **interview-ready** demo showing React, Three.js, and modern frontend patterns.

## Goals

- Load GLB/GLTF models with a progress bar and error fallback
- Manipulate **camera** (orbit, zoom, presets: Top, Front, Isometric) and **materials** (Standard/Physical PBR, color swatches, wireframe)
- Control **lighting** (ambient, directional, point) with sliders and shadow maps
- **Click-to-focus**: click the model to recenter the camera on its bounding box
- **State**: Zustand for UI/viewer state, TanStack Query for product metadata (mock API)
- **Performance**: clamped DPR, optional LOD switch, FPS overlay
- **Accessibility**: keyboard-friendly controls, ARIA labels, semantic layout

## Tech stack

- **React** + **TypeScript**
- **Vite** (dev + build)
- **Three.js** + **React Three Fiber** (R3F) + **@react-three/drei**
- **Zustand** (viewer/loader state)
- **TanStack Query** (product API, caching)
- **React Router** (/, /about, /debug)

## How to run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). Use the **Viewer** to load the default helmet model, then try camera presets, material swatches, and lighting sliders.

```bash
pnpm build
pnpm preview
```

## Project structure

- `src/scene/` — R3F scene graph: `SceneRoot`, `Model`, `Lights`, `Ground`, `CameraPresets`, `SyncLoaderProgress`
- `src/store/` — Zustand: `viewerStore` (camera, material, lights, debug), `loaderStore` (loading, progress, error)
- `src/components/` — Layout, ErrorBoundary, ViewerControls, LoaderOverlay, StatsOverlay
- `src/pages/` — ViewerPage, AboutPage, DebugPage
- `src/api/` — Mock product API and `useProductQuery` (TanStack Query)

## Architecture (high level)

- **Canvas** (R3F) owns a single WebGL context; the React tree describes the 3D graph (lights, model, controls).
- **Zustand** holds UI state (preset, material, lights, stats) so the canvas can subscribe without forcing full app re-renders.
- **Drei’s** `useProgress` is synced to `loaderStore` for the loading overlay; failed loads trigger an ErrorBoundary and a fallback placeholder.
- **TanStack Query** fetches product metadata; the Debug page shows cache and loader state.

## License

MIT.
