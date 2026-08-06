import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'
import { getNavItemByHref } from '@/components/layout/nav-config'

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const activeItem = getNavItemByHref(pathname)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        to="/"
        className="text-foreground-tertiary hover:text-foreground-secondary flex items-center transition-colors"
        aria-label="Dashboard"
      >
        <Home className="size-3.5" aria-hidden="true" />
      </Link>
      {activeItem && activeItem.href !== '/' && (
        <>
          <ChevronRight className="text-foreground-tertiary size-3.5" aria-hidden="true" />
          <span className="text-foreground font-medium">{activeItem.label}</span>
        </>
      )}
    </nav>
  )
}
