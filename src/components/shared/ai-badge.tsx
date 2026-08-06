import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIBadgeProps {
  label?: string
  className?: string
}

/** Marks AI-generated or AI-reviewed content. Used sparingly, next to
 * suggestions, extracted fields, or auto-filled values. */
export function AIBadge({ label = 'AI', className }: AIBadgeProps) {
  return (
    <span
      className={cn(
        'bg-ai-subtle text-ai-subtle-foreground inline-flex h-5 items-center gap-1 rounded-full px-2 text-[0.6875rem] font-medium tracking-wide',
        className
      )}
    >
      <Sparkles className="size-3" aria-hidden="true" />
      {label}
    </span>
  )
}
