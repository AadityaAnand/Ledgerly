import { ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApprovalBadgeProps {
  className?: string
}

/** "A human needs to sign off on this." Warm amber, not alarm red — this
 * is a normal step in the workflow, not an error. */
export function ApprovalBadge({ className }: ApprovalBadgeProps) {
  return (
    <span
      className={cn(
        'bg-warning-subtle text-warning-subtle-foreground inline-flex h-5.5 items-center gap-1 rounded-full px-2 text-[0.6875rem] font-medium whitespace-nowrap',
        className
      )}
    >
      <ShieldAlert className="size-3" aria-hidden="true" />
      Needs Approval
    </span>
  )
}
