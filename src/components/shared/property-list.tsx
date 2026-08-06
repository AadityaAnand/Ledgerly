import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PropertyItem {
  label: string
  value: ReactNode
}

interface PropertyListProps {
  items: PropertyItem[]
  className?: string
}

/** Labeled key/value rows for entity detail panels (return summary, client
 * profile, document metadata). */
export function PropertyList({ items, className }: PropertyListProps) {
  return (
    <dl className={cn('flex flex-col', className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="border-border-subtle flex items-start justify-between gap-4 border-b py-2.5 text-sm last:border-b-0"
        >
          <dt className="text-foreground-secondary shrink-0">{item.label}</dt>
          <dd className="text-foreground min-w-0 text-right font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
