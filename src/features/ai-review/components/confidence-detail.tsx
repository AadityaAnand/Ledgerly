import { useState } from 'react'
import { ChevronDown, Circle, CircleCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { ConfidenceIndicator } from '@/components/shared/field-affordance'
import { getConfidenceLevel } from '@/utils/status'
import { transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { isHighConfidence } from '../lib/ai-status'

interface ConfidenceDetailProps {
  confidence: number
  confidenceReasons: string[]
  uncertaintyReasons?: string[]
  className?: string
}

const levelCopy: Record<string, string> = {
  high: 'High confidence',
  medium: 'Needs review',
  low: 'Needs review',
}

/** Confidence is never just a number — this always pairs the score with a
 * plain-language "what does this mean" line, and the checklist behind it
 * is expandable rather than shown by default (progressive disclosure). */
export function ConfidenceDetail({ confidence, confidenceReasons, uncertaintyReasons, className }: ConfidenceDetailProps) {
  const [expanded, setExpanded] = useState(false)
  const level = getConfidenceLevel(confidence)
  const high = isHighConfidence(confidence)
  const reasons = high ? confidenceReasons : (uncertaintyReasons ?? [])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-3">
        <ConfidenceIndicator score={confidence} size="md" />
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">{levelCopy[level]}</span>
          <span className="text-foreground-tertiary text-xs tabular-nums">{confidence}% confidence</span>
        </div>
        {reasons.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="text-foreground-tertiary hover:text-foreground ml-auto flex items-center gap-1 text-xs font-medium"
          >
            {expanded ? 'Hide details' : 'Why?'}
            <ChevronDown className={cn('size-3.5 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
          </button>
        )}
      </div>

      {expanded && reasons.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={transitions.fast}
          className="overflow-hidden"
        >
          <div className="border-border-subtle bg-surface flex flex-col gap-1.5 rounded-lg border p-3">
            <p className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">
              {high ? 'Based on' : 'Why confidence is lower'}
            </p>
            <ul className="flex flex-col gap-1.5">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2 text-sm leading-relaxed">
                  {high ? (
                    <CircleCheck className="text-success mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle className="text-foreground-tertiary mt-0.5 size-2 shrink-0 fill-current" aria-hidden="true" />
                  )}
                  <span className="text-foreground-secondary">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
