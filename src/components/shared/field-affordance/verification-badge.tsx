import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VerificationBadgeProps {
  reviewerName?: string
  className?: string
}

/** "This has been reviewed" — a checkmark and, when there's room, who did
 * it. Never implies the value is editable. */
export function VerificationBadge({ reviewerName, className }: VerificationBadgeProps) {
  return (
    <span
      className={cn(
        'bg-success-subtle text-success-subtle-foreground inline-flex h-5.5 items-center gap-1 rounded-full px-2 text-[0.6875rem] font-medium whitespace-nowrap',
        className
      )}
    >
      <Check className="size-3" aria-hidden="true" />
      {reviewerName ? `Verified by ${reviewerName}` : 'Verified'}
    </span>
  )
}
