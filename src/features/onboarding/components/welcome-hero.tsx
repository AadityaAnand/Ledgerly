import { Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import { RadialProgress } from './radial-progress'

interface WelcomeHeroProps {
  firstName: string
  returnLabel: string
  percentComplete: number
  /** Omit when there's no meaningful checklist-time estimate (e.g. a
   * returning client with no onboarding steps left) — the clause is hidden
   * rather than showing a misleading "0 min left". */
  estimatedMinutesRemaining?: number
  statusLabel: string
}

export function WelcomeHero({
  firstName,
  returnLabel,
  percentComplete,
  estimatedMinutesRemaining,
  statusLabel,
}: WelcomeHeroProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="border-border bg-surface-raised flex flex-col items-start gap-6 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="text-foreground-secondary mt-1.5 text-sm">{returnLabel}</p>
        <p className="text-foreground-tertiary mt-3 flex items-center gap-1.5 text-sm">
          <Clock className="size-3.5 shrink-0" aria-hidden="true" />
          {estimatedMinutesRemaining !== undefined ? `About ${estimatedMinutesRemaining} min left · ` : ''}
          {statusLabel}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <RadialProgress percent={percentComplete}>
          <span className="text-foreground text-lg font-semibold tabular-nums">{percentComplete}%</span>
        </RadialProgress>
      </div>
    </motion.div>
  )
}
