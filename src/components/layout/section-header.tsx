import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

/** Smaller header for a section within a page — sits above a card, table,
 * or list. */
export function SectionHeader({ title, description, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-foreground text-base font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-foreground-secondary mt-0.5 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
