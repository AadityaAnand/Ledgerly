import { ConfidenceMeter } from '@/components/shared/confidence-meter'
import { getConfidenceLevel } from '@/utils/status'
import { cn } from '@/lib/utils'

/** The radial confidence ring already built for Challenge 1 — reused
 * directly rather than rebuilt, aliased here so the field-affordance
 * system exposes it under the name this challenge asks for. */
export { ConfidenceMeter as ConfidenceIndicator }

const levelTextClass = {
  high: 'text-success',
  medium: 'text-warning',
  low: 'text-danger',
} as const

/** The compact inline-text form — "96% confidence" — used wherever the
 * radial ring would be too heavy (inline in a sentence, a dense list row). */
export function ConfidenceLabel({ score, className }: { score: number; className?: string }) {
  const level = getConfidenceLevel(score)
  return (
    <span className={cn('text-xs font-medium tabular-nums', levelTextClass[level], className)}>
      {score}% confidence
    </span>
  )
}
