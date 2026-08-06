import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InfoCardProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/** Generic bordered card for settings sections, sidebar callouts, etc. */
export function InfoCard({ icon: Icon, title, description, action, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        'bg-surface-raised border-border flex items-start gap-3.5 rounded-xl border p-4',
        className
      )}
    >
      {Icon && (
        <div className="bg-primary-subtle text-primary-subtle-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="text-foreground text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-foreground-secondary mt-1 text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
