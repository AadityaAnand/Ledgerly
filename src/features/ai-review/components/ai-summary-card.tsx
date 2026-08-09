import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getAIFindingsByReturnId } from '@/mock/ai-findings'
import { isHighConfidence } from '../lib/ai-status'
import { cn } from '@/lib/utils'

interface AISummaryCardProps {
  returnId: string
  className?: string
}

/** The compact "AI Review" rollup for a single return — what's been
 * analyzed, what's clean, what needs a look. Every number here is a link
 * straight into the relevant findings, never a dead end. */
export function AISummaryCard({ returnId, className }: AISummaryCardProps) {
  const navigate = useNavigate()
  const findings = getAIFindingsByReturnId(returnId)

  const analyzed = findings.length
  const highConfidence = findings.filter((f) => isHighConfidence(f.confidence)).length
  const needsReview = findings.filter((f) => f.status === 'needs_review').length
  const potentialIssues = findings.filter((f) => f.severity === 'critical').length
  const recommendations = findings.filter((f) => f.recommendation.action !== 'view_details' && f.status !== 'human_verified' && f.status !== 'dismissed' && f.status !== 'rejected').length

  if (analyzed === 0) {
    return (
      <div className={cn('border-border bg-surface-raised flex items-center gap-3 rounded-xl border p-4', className)}>
        <div className="bg-ai-subtle text-ai-subtle-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Sparkles className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">AI Review</p>
          <p className="text-foreground-tertiary text-xs">Nothing analyzed on this return yet.</p>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => void navigate({ to: `/ai-review?returnId=${returnId}` })}
      className={cn(
        'border-border bg-surface-raised hover:border-ai/40 hover:bg-surface-hover flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-colors',
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="bg-ai-subtle text-ai-subtle-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Sparkles className="size-4" aria-hidden="true" />
        </div>
        <p className="text-foreground text-sm font-semibold">AI Review</p>
        <span className="text-foreground-tertiary ml-auto flex items-center gap-1 text-xs font-medium">
          Review priority items
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-5">
        <div>
          <dt className="text-foreground-tertiary text-xs">Analyzed</dt>
          <dd className="text-foreground text-lg font-semibold tabular-nums">{analyzed}</dd>
        </div>
        <div>
          <dt className="text-foreground-tertiary text-xs">High confidence</dt>
          <dd className="text-success text-lg font-semibold tabular-nums">{highConfidence}</dd>
        </div>
        <div>
          <dt className="text-foreground-tertiary text-xs">Need review</dt>
          <dd className="text-warning text-lg font-semibold tabular-nums">{needsReview}</dd>
        </div>
        <div>
          <dt className="text-foreground-tertiary text-xs">Potential issues</dt>
          <dd className="text-danger text-lg font-semibold tabular-nums">{potentialIssues}</dd>
        </div>
        <div>
          <dt className="text-foreground-tertiary text-xs">Recommendations</dt>
          <dd className="text-foreground text-lg font-semibold tabular-nums">{recommendations}</dd>
        </div>
      </dl>
    </button>
  )
}
