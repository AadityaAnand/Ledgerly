import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ActiveFilter {
  id: string
  label: string
  onRemove: () => void
}

interface FilterBarProps {
  /** Filter trigger controls (selects, popovers, toggle groups…). */
  children: ReactNode
  activeFilters?: ActiveFilter[]
  onClearAll?: () => void
  className?: string
}

/** Toolbar row for list/table filters, with an active-filter chip tray
 * that only appears once something is applied. */
export function FilterBar({ children, activeFilters = [], onClearAll, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={filter.onRemove}
              className="bg-surface hover:bg-surface-hover text-foreground-secondary inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-medium"
            >
              {filter.label}
              <X className="size-3" aria-hidden="true" />
            </button>
          ))}
          {onClearAll && (
            <Button variant="link" size="sm" className="h-6 px-1.5 text-xs" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
