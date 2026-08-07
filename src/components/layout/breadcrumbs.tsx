import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'
import { getNavItemByHref } from '@/components/layout/nav-config'
import { useBreadcrumbStore } from '@/store/breadcrumb-store'

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const activeItem = getNavItemByHref(pathname)
  const trailingLabel = useBreadcrumbStore((s) => s.trailingLabel)

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
          {trailingLabel ? (
            <Link
              to={activeItem.href}
              className="text-foreground-tertiary hover:text-foreground-secondary font-medium transition-colors"
            >
              {activeItem.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{activeItem.label}</span>
          )}
        </>
      )}
      {trailingLabel && (
        <>
          <ChevronRight className="text-foreground-tertiary size-3.5" aria-hidden="true" />
          <span className="text-foreground max-w-72 truncate font-medium">{trailingLabel}</span>
        </>
      )}
    </nav>
  )
}
