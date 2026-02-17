import { Outlet } from 'react-router-dom'
import { type ReactNode } from 'react'

interface LayoutProps {
  header?: ReactNode
  footer?: ReactNode
}

/** App shell: header, main (outlet), optional footer. Side panel lives inside viewer route. */
export function Layout({ header, footer }: LayoutProps) {
  return (
    <div className="app-layout">
      {header != null && <header className="app-header">{header}</header>}
      <main className="app-main" id="main-content">
        <Outlet />
      </main>
      {footer != null && <footer className="app-footer">{footer}</footer>}
    </div>
  )
}
