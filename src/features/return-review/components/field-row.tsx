import { Calculator, FileSearch, FileWarning } from 'lucide-react'
import { motion } from 'framer-motion'
import { ConfidenceIndicator } from '@/components/shared/field-affordance/confidence-indicator'
import { VerificationBadge } from '@/components/shared/field-affordance/verification-badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { verificationStatusMeta } from '@/utils/status'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { TaxFieldTrace } from '@/types'

interface FieldRowProps {
  trace: TaxFieldTrace
  isSelected: boolean
  onSelect: () => void
  onHoverChange: (hovering: boolean) => void
}

function TraceIndicator({ trace }: { trace: TaxFieldTrace }) {
  if (trace.isCalculated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-foreground-tertiary flex size-5 items-center justify-center">
            <Calculator className="size-3.5" aria-hidden="true" />
          </span>
        </TooltipTrigger>
        <TooltipContent>Calculated value — no single source document</TooltipContent>
      </Tooltip>
    )
  }
  if (!trace.sourceDocumentId) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-warning flex size-5 items-center justify-center">
            <FileWarning className="size-3.5" aria-hidden="true" />
          </span>
        </TooltipTrigger>
        <TooltipContent>Awaiting source document</TooltipContent>
      </Tooltip>
    )
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-ai flex size-5 items-center justify-center">
          <FileSearch className="size-3.5" aria-hidden="true" />
        </span>
      </TooltipTrigger>
      <TooltipContent>Traced to a source document</TooltipContent>
    </Tooltip>
  )
}

export function FieldRow({ trace, isSelected, onSelect, onHoverChange }: FieldRowProps) {
  return (
    <motion.button
      type="button"
      layout="position"
      onClick={onSelect}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      aria-pressed={isSelected}
      className={cn(
        'group border-border-subtle flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 focus-visible:-outline-offset-2',
        isSelected ? 'bg-primary-subtle' : 'hover:bg-surface-hover'
      )}
    >
      <span
        className={cn(
          'h-8 w-0.5 shrink-0 rounded-full transition-colors',
          isSelected ? 'bg-primary' : 'bg-transparent'
        )}
      />

      <TraceIndicator trace={trace} />

      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{trace.label}</p>
        <p className="text-foreground-tertiary truncate text-xs">{trace.formLine}</p>
      </div>

      {trace.hasConflict && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="bg-danger size-1.5 shrink-0 rounded-full"
              aria-label="Conflicting source values"
            />
          </TooltipTrigger>
          <TooltipContent>Conflicting source values</TooltipContent>
        </Tooltip>
      )}

      <span className="text-foreground w-20 shrink-0 text-right text-sm font-medium tabular-nums">
        {formatCurrency(trace.value)}
      </span>

      <ConfidenceIndicator score={trace.confidence} size="sm" />

      {trace.verification === 'verified' ? (
        <VerificationBadge className="shrink-0" />
      ) : (
        <StatusBadge {...verificationStatusMeta[trace.verification]} className="shrink-0 whitespace-nowrap" />
      )}
    </motion.button>
  )
}
