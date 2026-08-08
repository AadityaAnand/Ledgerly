import { ArrowRight, CalendarClock, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/user-avatar'
import { panelSwap } from '@/lib/animations'
import { formatDate } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { ReturnNextAction } from '@/types'

interface ReturnNextActionCardProps {
  nextAction: ReturnNextAction
  ownerLabel: string
  ownerAvatarUrl?: string
  isComplete?: boolean
  onNavigate?: () => void
}

/** The single, unambiguous "what happens next" card — who owns it, when
 * it's due, and one clear way to act on it. */
export function ReturnNextActionCard({
  nextAction,
  ownerLabel,
  ownerAvatarUrl,
  isComplete = false,
  onNavigate,
}: ReturnNextActionCardProps) {
  return (
    <motion.div
      variants={panelSwap}
      initial="hidden"
      animate="visible"
      className={cn(
        'rounded-2xl border p-5',
        isComplete ? 'border-success/20 bg-success-subtle/40' : 'border-primary/20 bg-primary-subtle/40'
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl',
            isComplete ? 'bg-success text-white' : 'bg-primary text-primary-foreground'
          )}
        >
          {isComplete ? (
            <CheckCircle2 className="size-5" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">Next</p>
          <p className="text-foreground mt-1 text-base font-semibold text-balance">{nextAction.action}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-foreground-secondary flex items-center gap-1.5 text-xs">
              <UserAvatar name={ownerLabel} avatarUrl={ownerAvatarUrl} size="sm" className="size-5" />
              {ownerLabel}
            </span>
            {nextAction.dueDate && (
              <span className="text-foreground-tertiary flex items-center gap-1.5 text-xs">
                <CalendarClock className="size-3.5" aria-hidden="true" />
                Due {formatDate(nextAction.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      {onNavigate && !isComplete && (
        <div className="mt-4 flex justify-end">
          <Button size="sm" className="gap-1.5" onClick={onNavigate}>
            {nextAction.ctaLabel}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      )}
    </motion.div>
  )
}
