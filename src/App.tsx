import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ViewerPage } from './pages/ViewerPage'
import { AboutPage } from './pages/AboutPage'
import { DebugPage } from './pages/DebugPage'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

function AppHeader() {
  return (
    <>
      <h1 className="app-title">
        <Link to="/">3D Product Viewer</Link>
      </h1>
      <nav className="app-nav" aria-label="Main">
        <Link to="/">Viewer</Link>
        <Link to="/about">About</Link>
        <Link to="/debug">Debug</Link>
      </nav>
    </>
  )
}

function AppFooter() {
  return (
    <small>
      React + Three.js + React Three Fiber • Product Viewer demo
    </small>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout header={<AppHeader />} footer={<AppFooter />} />}>
              <Route index element={<ViewerPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="debug" element={<DebugPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
