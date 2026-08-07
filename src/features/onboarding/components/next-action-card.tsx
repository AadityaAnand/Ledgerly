import { ClipboardList, Loader2, PenLine, Sparkles, UploadCloud } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { panelSwap, transitions } from '@/lib/animations'
import { taskPriorityMeta } from '@/utils/status'
import type { NextActionDetail } from '@/types'

const iconByType = {
  upload: UploadCloud,
  questionnaire: ClipboardList,
  review: Sparkles,
  sign: PenLine,
}

interface NextActionCardProps {
  action: NextActionDetail
  isCompleting: boolean
  onComplete: () => void
}

/** The page's single primary focus — one recommended next step, front and
 * center, with one unambiguous call to action. */
export function NextActionCard({ action, isCompleting, onComplete }: NextActionCardProps) {
  const Icon = iconByType[action.icon]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={action.stepId}
        variants={panelSwap}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="border-primary/20 bg-primary-subtle/40 relative overflow-hidden rounded-2xl border p-7 sm:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">
                Next recommended action
              </p>
              <h2 className="text-foreground mt-1 text-xl font-semibold tracking-tight text-balance sm:text-2xl">
                {action.title}
              </h2>
              <p className="text-foreground-secondary mt-2 max-w-xl text-sm leading-relaxed">
                {action.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge label={`~${action.estimatedMinutes} min`} tone="neutral" />
                <StatusBadge {...taskPriorityMeta[action.priority]} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end sm:mt-7">
          <Button size="lg" className="min-w-44 gap-2" onClick={onComplete} disabled={isCompleting}>
            {isCompleting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Working on it…
              </>
            ) : (
              action.ctaLabel
            )}
          </Button>
        </div>

        <motion.div
          className="bg-primary/10 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-2xl"
          animate={{ scale: isCompleting ? 1.15 : 1 }}
          transition={transitions.slow}
          aria-hidden="true"
        />
      </motion.div>
    </AnimatePresence>
  )
}
