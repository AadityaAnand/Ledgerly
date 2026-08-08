import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LockedIndicatorProps {
  className?: string
}

/** "This can't be changed" — a plain lock, muted. Locked content should
 * never look broken or merely disabled; this pairs with a short written
 * reason wherever it appears, never on its own. */
export function LockedIndicator({ className }: LockedIndicatorProps) {
  return (
    <span
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-5.5 items-center gap-1 rounded-full px-2 text-[0.6875rem] font-medium whitespace-nowrap',
        className
      )}
    >
      <Lock className="size-3" aria-hidden="true" />
      Locked
    </span>
  )
}
