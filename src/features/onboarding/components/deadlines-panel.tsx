import { differenceInCalendarDays, parseISO } from 'date-fns'
import { CalendarClock, FileStack, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/format'
import type { OnboardingDeadline } from '@/types'

const iconByKind = {
  documents: FileStack,
  review: Sparkles,
  filing: CalendarClock,
}

function urgencyClass(daysUntil: number) {
  if (daysUntil <= 7) return 'bg-danger'
  if (daysUntil <= 30) return 'bg-warning'
  return 'bg-foreground-tertiary'
}

interface DeadlinesPanelProps {
  deadlines: OnboardingDeadline[]
}

export function DeadlinesPanel({ deadlines }: DeadlinesPanelProps) {
  return (
    <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
      {deadlines.map((deadline) => {
        const Icon = iconByKind[deadline.kind]
        const daysUntil = differenceInCalendarDays(parseISO(deadline.dueDate), new Date())

        return (
          <motion.li
            key={deadline.id}
            variants={staggerItem}
            className="border-border-subtle flex items-center gap-3 rounded-lg border px-3 py-2.5"
          >
            <div className="bg-surface flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Icon className="text-foreground-tertiary size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-medium">{deadline.label}</p>
              {deadline.description && (
                <p className="text-foreground-tertiary text-xs">{deadline.description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className={cn('size-1.5 rounded-full', urgencyClass(daysUntil))} aria-hidden="true" />
              <span className="text-foreground-secondary text-xs tabular-nums">{formatDate(deadline.dueDate)}</span>
            </div>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
