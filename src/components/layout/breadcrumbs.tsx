import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import { getNavItemByHref } from '@/components/layout/nav-config'
import { useNavigationStore } from '@/store/navigation-store'
import { transitions } from '@/lib/animations'

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const activeItem = getNavItemByHref(pathname)
  const trail = useNavigationStore((s) => s.trail)
  const truncateTo = useNavigationStore((s) => s.truncateTo)

  const lastNode = trail[trail.length - 1]
  const trailIsCurrent = lastNode && lastNode.href === pathname

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      <Link
        to="/"
        className="text-foreground-tertiary hover:text-foreground-secondary flex shrink-0 items-center transition-colors"
        aria-label="Dashboard"
      >
        <Home className="size-3.5" aria-hidden="true" />
      </Link>

      {trailIsCurrent ? (
        <AnimatePresence initial={false} mode="popLayout">
          {trail.map((node, index) => {
            const isLast = index === trail.length - 1
            return (
              <motion.span
                key={`${node.type}-${node.id}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={transitions.fast}
                className="flex min-w-0 items-center gap-1.5"
              >
                <ChevronRight className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
                {isLast ? (
                  <span className="text-foreground max-w-56 truncate font-medium">{node.label}</span>
                ) : (
                  <Link
                    to={node.href}
                    onClick={() => truncateTo(index)}
                    className="text-foreground-tertiary hover:text-foreground-secondary max-w-40 truncate font-medium transition-colors"
                  >
                    {node.label}
                  </Link>
                )}
              </motion.span>
            )
          })}
        </AnimatePresence>
      ) : (
        activeItem &&
        activeItem.href !== '/' && (
          <>
            <ChevronRight className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
            <span className="text-foreground font-medium">{activeItem.label}</span>
          </>
        )
      )}
    </nav>
  )
}
