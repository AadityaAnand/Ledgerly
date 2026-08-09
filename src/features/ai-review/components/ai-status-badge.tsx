import { VerificationBadge } from '@/components/shared/field-affordance'
import { aiFindingStatusMeta } from '../lib/ai-status'
import { cn } from '@/lib/utils'
import type { AIFindingStatus } from '@/types'

interface AIStatusBadgeProps {
  status: AIFindingStatus
  reviewerName?: string
  className?: string
}

/** One badge for every point in an AI finding's lifecycle — delegates to
 * the existing `VerificationBadge` for "Human Verified" so the same visual
 * language is used everywhere a human has signed off, in AI Review or
 * anywhere else. */
export function AIStatusBadge({ status, reviewerName, className }: AIStatusBadgeProps) {
  if (status === 'human_verified') {
    return <VerificationBadge reviewerName={reviewerName} className={className} />
  }

  const meta = aiFindingStatusMeta[status]
  return (
    <span
      className={cn(
        'inline-flex h-5.5 items-center gap-1 rounded-full px-2 text-[0.6875rem] font-medium whitespace-nowrap',
        meta.tone,
        className
      )}
    >
      <meta.icon className="size-3" aria-hidden="true" />
      {meta.label}
    </span>
  )
}
