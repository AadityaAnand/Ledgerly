import { StatusBadge } from '@/components/shared/status-badge'
import { getStageDefinition, stageIcons, conditionLabels } from '@/lib/return-lifecycle'
import { conditionTone } from '@/utils/status'
import type { ReturnCondition, ReturnStage } from '@/types'

export function StageBadge({ stage, className }: { stage: ReturnStage; className?: string }) {
  const definition = getStageDefinition(stage)
  const Icon = stageIcons[stage]
  return (
    <StatusBadge
      label={definition.label}
      tone={stage === 'filed' ? 'success' : 'primary'}
      icon={<Icon className="size-3" aria-hidden="true" />}
      className={className}
    />
  )
}

export function ConditionBadge({ condition, className }: { condition: ReturnCondition; className?: string }) {
  return <StatusBadge label={conditionLabels[condition]} tone={conditionTone[condition]} className={className} />
}
