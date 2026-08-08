import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BlockerBanner } from './blocker-banner'
import { TIMELINE_STAGES, getStageDefinition, stageIcons } from '@/lib/return-lifecycle'
import { getDocumentsByReturnId } from '@/mock/documents'
import { getUserById } from '@/mock/users'
import { useActiveRole } from '@/hooks/use-role'
import { transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { ReturnStatusDetail, TaxReturn } from '@/types'

interface StageTimelineProps {
  taxReturn: TaxReturn
  detail: ReturnStatusDetail
  className?: string
}

/** The shared six-step lifecycle, rendered identically for every role —
 * only the description text inside each stage's popover changes. Click any
 * stage to see what happened (or what's still ahead). */
export function StageTimeline({ taxReturn, detail, className }: StageTimelineProps) {
  const role = useActiveRole()
  const isClientRole = role === 'CLIENT' || role === 'BUSINESS_OWNER'
  const currentPosition = getStageDefinition(detail.stage).position
  const documents = getDocumentsByReturnId(taxReturn.id)
  const reviewer = taxReturn.assignedReviewerId ? getUserById(taxReturn.assignedReviewerId) : undefined

  return (
    <ol className={cn('flex flex-col', className)}>
      {TIMELINE_STAGES.map((def, index) => {
        const isComplete = def.position < currentPosition || detail.stage === 'filed'
        const isCurrent = def.position === currentPosition && detail.stage !== 'filed'
        const justCompleted = detail.justCompletedStage === def.stage
        const Icon = stageIcons[def.stage]
        const description = isClientRole ? def.clientDescription : def.staffDescription

        return (
          <li key={def.stage} className="relative flex gap-3 pb-6 last:pb-0">
            {index < TIMELINE_STAGES.length - 1 && (
              <span
                className={cn(
                  'absolute top-7 left-3.5 h-[calc(100%-1.75rem)] w-px transition-colors',
                  isComplete ? 'bg-success/40' : 'bg-border'
                )}
                aria-hidden="true"
              />
            )}

            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  type="button"
                  initial={justCompleted ? { scale: 0.7 } : false}
                  animate={{ scale: 1 }}
                  transition={transitions.spring}
                  aria-label={`${def.label} — ${isComplete ? 'completed' : isCurrent ? 'in progress' : 'not started'}`}
                  className={cn(
                    'focus-visible:-outline-offset-2 relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    isComplete && 'bg-success border-success',
                    isCurrent && 'border-primary bg-primary-subtle',
                    !isComplete && !isCurrent && 'border-border-strong bg-surface'
                  )}
                >
                  {isComplete ? (
                    <Check className="size-3.5 text-white" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    <Icon
                      className={cn('size-3.5', isCurrent ? 'text-primary' : 'text-foreground-tertiary')}
                      aria-hidden="true"
                    />
                  )}
                </motion.button>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-80">
                <p className="text-foreground text-sm font-semibold">{def.label}</p>
                <p className="text-foreground-secondary mt-1 text-sm leading-relaxed">{description}</p>

                {def.stage === 'documents_collected' && documents.length > 0 && (
                  <p className="text-foreground-tertiary mt-2 text-xs">
                    {documents.length} document{documents.length === 1 ? '' : 's'} on file
                  </p>
                )}
                {def.stage === 'cpa_review' && reviewer && (
                  <p className="text-foreground-tertiary mt-2 text-xs">Assigned reviewer: {reviewer.name}</p>
                )}

                {isCurrent && detail.blocker && (
                  <div className="mt-3">
                    <BlockerBanner blocker={detail.blocker} />
                  </div>
                )}
                {isCurrent && !detail.blocker && (
                  <p className="text-foreground-tertiary mt-2 text-xs">Currently in progress.</p>
                )}
                {!isComplete && !isCurrent && (
                  <p className="text-foreground-tertiary mt-2 text-xs">This step hasn’t started yet.</p>
                )}
              </PopoverContent>
            </Popover>

            <div className="min-w-0 flex-1 pt-1">
              <p
                className={cn(
                  'text-sm',
                  isCurrent
                    ? 'text-foreground font-semibold'
                    : isComplete
                      ? 'text-foreground-secondary'
                      : 'text-foreground-tertiary'
                )}
              >
                {def.label}
              </p>
              {isCurrent && <p className="text-foreground-tertiary mt-0.5 text-xs">{description}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
