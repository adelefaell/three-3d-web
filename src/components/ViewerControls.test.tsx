import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ViewerControls } from './ViewerControls'
import { useViewerStore } from '../store/viewerStore'

function Wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('ViewerControls', () => {
  beforeEach(() => {
    useViewerStore.setState({
      cameraPreset: 'free',
      materialType: 'standard',
      selectedColor: '#888888',
    })
  })

  it('renders camera preset buttons', () => {
    render(
      <Wrapper>
        <ViewerControls />
      </Wrapper>,
    )
    expect(screen.getByRole('button', { name: /free/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /top/i })).toBeInTheDocument()
  })

  it('updates store when camera preset is clicked', () => {
    render(
      <Wrapper>
        <ViewerControls />
      </Wrapper>,
    )
    fireEvent.click(screen.getByRole('button', { name: /top/i }))
    expect(useViewerStore.getState().cameraPreset).toBe('top')
  })

  it('updates store when material type is clicked', () => {
    render(
      <Wrapper>
        <ViewerControls />
      </Wrapper>,
    )
    fireEvent.click(screen.getByRole('button', { name: /physical/i }))
    expect(useViewerStore.getState().materialType).toBe('physical')
  })
})
