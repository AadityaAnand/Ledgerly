import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Tone } from '@/utils/status'

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  primary: 'bg-primary-subtle text-primary-subtle-foreground',
  success: 'bg-success-subtle text-success-subtle-foreground',
  warning: 'bg-warning-subtle text-warning-subtle-foreground',
  danger: 'bg-danger-subtle text-danger-subtle-foreground',
  ai: 'bg-ai-subtle text-ai-subtle-foreground',
}

const dotClasses: Record<Tone, string> = {
  neutral: 'bg-foreground-tertiary',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  ai: 'bg-ai',
}

interface StatusBadgeProps {
  label: string
  tone: Tone
  /** Shows a small colored dot before the label instead of an icon. Default true. */
  dot?: boolean
  icon?: ReactNode
  className?: string
}

/** Generic status pill. Feed it a status meta object from `utils/status.ts`,
 * e.g. `<StatusBadge {...returnStatusMeta[status]} />`. */
export function StatusBadge({ label, tone, dot = true, icon, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap',
        toneClasses[tone],
        className
      )}
    >
      {icon}
      {!icon && dot && <span className={cn('size-1.5 rounded-full', dotClasses[tone])} aria-hidden="true" />}
      {label}
    </span>
  )
}
