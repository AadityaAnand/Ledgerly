import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { IconButton } from '@/components/shared/icon-button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface InspectorPanelProps {
  title: string
  subtitle?: string
  onClose?: () => void
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** Chrome for a contextual detail panel — a title bar with an optional
 * close affordance over a scrollable body. Pair with `SplitLayout` for an
 * inline panel, or drop inside a `Sheet` for an overlay panel. */
export function InspectorPanel({
  title,
  subtitle,
  onClose,
  actions,
  children,
  className,
}: InspectorPanelProps) {
  return (
    <div className={cn('bg-surface-raised flex h-full flex-col', className)}>
      <div className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3.5">
        <div className="min-w-0">
          <h2 className="text-foreground truncate text-sm font-semibold">{title}</h2>
          {subtitle && <p className="text-foreground-tertiary truncate text-xs">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {actions}
          {onClose && <IconButton label="Close panel" icon={<X className="size-4" />} onClick={onClose} />}
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4">{children}</div>
      </ScrollArea>
    </div>
  )
}
