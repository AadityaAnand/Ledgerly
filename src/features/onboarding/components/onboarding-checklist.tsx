import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { staggerContainer, staggerItem, transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { OnboardingStep } from '@/types'

interface OnboardingChecklistProps {
  steps: OnboardingStep[]
  currentStepId?: string
}

export function OnboardingChecklist({ steps, currentStepId }: OnboardingChecklistProps) {
  return (
    <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-1">
      {steps.map((step) => {
        const isComplete = step.status === 'complete'
        const isCurrent = step.id === currentStepId

        return (
          <motion.li
            key={step.id}
            variants={staggerItem}
            className={cn(
              'flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors',
              isCurrent && 'bg-primary-subtle/60'
            )}
          >
            <span
              className={cn(
                'relative flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                isComplete
                  ? 'bg-success border-success'
                  : isCurrent
                    ? 'border-primary'
                    : 'border-border-strong'
              )}
            >
              <AnimatePresence>
                {isComplete && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={transitions.spring}
                    className="flex items-center justify-center"
                  >
                    <Check className="size-3 text-white" strokeWidth={3} aria-hidden="true" />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span
              className={cn(
                'text-sm transition-colors',
                isComplete
                  ? 'text-foreground-tertiary line-through decoration-foreground-tertiary/40'
                  : isCurrent
                    ? 'text-foreground font-medium'
                    : 'text-foreground-secondary'
              )}
            >
              {step.label}
            </span>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
