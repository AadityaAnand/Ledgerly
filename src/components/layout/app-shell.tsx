import { Outlet } from '@tanstack/react-router'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'
import { ContextBar } from '@/components/layout/context-bar'
import { Footer } from '@/components/layout/footer'
import { CommandPalette } from '@/components/shared/command-palette'

/** The persistent shell every route renders inside: sidebar + top nav +
 * scrollable content area, with the command palette mounted globally. */
export function AppShell() {
  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <ContextBar />
        <main id="main-content" tabIndex={-1} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex min-h-0 flex-1 flex-col">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
