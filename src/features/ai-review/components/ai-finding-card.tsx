import { motion } from 'framer-motion'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { ConfidenceLabel } from '@/components/shared/field-affordance'
import { aiFindingActionLabel, aiFindingCategoryMeta, aiFindingSeverityMeta } from '../lib/ai-status'
import { AIStatusBadge } from './ai-status-badge'
import { staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { AIFinding } from '@/types'

interface AIFindingCardProps {
  finding: AIFinding
  isSelected: boolean
  onSelect: () => void
}

/** The default, collapsed view of a finding — exactly the amount of
 * information a reviewer needs to triage without opening it: what it is,
 * how confident the AI is, and what to do next. Everything else lives
 * behind the click (progressive disclosure). */
export function AIFindingCard({ finding, isSelected, onSelect }: AIFindingCardProps) {
  const taxReturn = getReturnById(finding.returnId)
  const client = getClientById(finding.clientId)
  const category = aiFindingCategoryMeta[finding.category]

  return (
    <motion.li variants={staggerItem}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={cn(
          'flex w-full flex-col gap-2 border-l-2 px-4 py-3 text-left transition-colors',
          isSelected ? 'border-l-primary bg-primary-subtle/40' : 'hover:bg-surface-hover border-l-transparent'
        )}
      >
        <div className="flex items-center gap-2">
          <category.icon className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
          <span className="text-foreground-tertiary text-xs font-medium">{category.label}</span>
          <span className={cn('rounded-full px-1.5 py-0.5 text-[0.6875rem] font-medium', aiFindingSeverityMeta[finding.severity].tone)}>
            {aiFindingSeverityMeta[finding.severity].label}
          </span>
          <AIStatusBadge status={finding.status} className="ml-auto" />
        </div>
        <p className="text-foreground truncate text-sm font-medium">{finding.title}</p>
        <p className="text-foreground-secondary line-clamp-2 text-xs leading-relaxed">{finding.explanation}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-foreground-tertiary truncate text-xs">
            {client?.name}
            {taxReturn ? ` · ${taxReturn.taxYear} ${taxReturn.formType}` : ''}
          </p>
          <ConfidenceLabel score={finding.confidence} />
        </div>
        <p className="text-primary text-xs font-medium">{aiFindingActionLabel[finding.recommendation.action]} →</p>
      </button>
    </motion.li>
  )
}
