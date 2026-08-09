import { Link, useRouterState } from '@tanstack/react-router'
import { AlertTriangle, FileStack, FileText, LayoutGrid, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReturnSearch } from './return-search'

interface ReturnWorkspaceNavProps {
  returnId: string
  issuesCount?: number
  aiFindingsCount?: number
}

interface Tab {
  label: string
  icon: LucideIcon
  href: string
  match: (pathname: string) => boolean
  count?: number
}

/** Persistent sub-navigation for a single return, rendered atop every level
 * of the workspace (Overview, Fields, Documents, Issues, AI Findings) so the
 * user always knows where they are and can move between levels in one click
 * without losing the return/client context above it (breadcrumbs, context bar). */
export function ReturnWorkspaceNav({ returnId, issuesCount, aiFindingsCount }: ReturnWorkspaceNavProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const tabs: Tab[] = [
    { label: 'Overview', icon: LayoutGrid, href: `/returns/${returnId}/overview`, match: (p) => p.endsWith('/overview') },
    { label: 'Fields', icon: FileStack, href: `/returns/${returnId}`, match: (p) => p === `/returns/${returnId}` },
    { label: 'Documents', icon: FileText, href: `/returns/${returnId}/documents`, match: (p) => p.endsWith('/documents') },
    {
      label: 'Issues',
      icon: AlertTriangle,
      href: `/returns/${returnId}/issues`,
      match: (p) => p.endsWith('/issues'),
      count: issuesCount,
    },
    {
      label: 'AI Findings',
      icon: Sparkles,
      href: `/returns/${returnId}/ai-findings`,
      match: (p) => p.endsWith('/ai-findings'),
      count: aiFindingsCount,
    },
  ]

  return (
    <nav
      aria-label="Return workspace sections"
      className="border-border-subtle bg-surface flex h-11 shrink-0 items-center gap-1 border-b px-4"
    >
      {tabs.map((tab) => {
        const isActive = tab.match(pathname)
        return (
          <Link
            key={tab.label}
            to={tab.href}
            className={cn(
              'flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-subtle text-primary-subtle-foreground'
                : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <tab.icon className="size-3.5" aria-hidden="true" />
            {tab.label}
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span
                className={cn(
                  'flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[0.6875rem] tabular-nums',
                  isActive ? 'bg-primary/20' : 'bg-muted text-muted-foreground'
                )}
              >
                {tab.count}
              </span>
            )}
          </Link>
        )
      })}

      <div className="ml-auto flex items-center">
        <ReturnSearch returnId={returnId} />
      </div>
    </nav>
  )
}
