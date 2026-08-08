import { motion } from 'framer-motion'
import { StageBadge, ConditionBadge } from './stage-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Progress } from '@/components/ui/progress'
import { staggerItem } from '@/lib/animations'
import { getEffectiveReturnStatus, getStageDefinition, TOTAL_ACTIVE_STEPS } from '@/lib/return-lifecycle'
import { getClientById } from '@/mock/clients'
import { getUserById } from '@/mock/users'
import { useActiveRole } from '@/hooks/use-role'
import { formatRelativeTime } from '@/utils/format'
import type { TaxReturn } from '@/types'

interface ReturnStatusSummaryCardProps {
  taxReturn: TaxReturn
  onOpen: () => void
}

/** The compact card used in return list/grid views — client, tax year,
 * type, stage, progress, next action, owner, and last updated at a glance.
 * Click to open the full `ReturnStatusPanel`. */
export function ReturnStatusSummaryCard({ taxReturn, onOpen }: ReturnStatusSummaryCardProps) {
  const role = useActiveRole()
  const isClientRole = role === 'CLIENT' || role === 'BUSINESS_OWNER'
  const detail = getEffectiveReturnStatus(taxReturn)
  const definition = getStageDefinition(detail.stage)
  const client = getClientById(taxReturn.clientId)
  const owner = getUserById(detail.nextAction.ownerId)
  const isFiled = detail.stage === 'filed'
  const progressPercent = isFiled ? 100 : Math.round((definition.position / TOTAL_ACTIVE_STEPS) * 100)

  return (
    <motion.button
      type="button"
      variants={staggerItem}
      onClick={onOpen}
      className="border-border bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full flex-col gap-3 rounded-xl border p-5 text-left transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-semibold">{client?.name}</p>
          <p className="text-foreground-tertiary text-xs">
            {taxReturn.taxYear} · Form {taxReturn.formType}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StageBadge stage={detail.stage} />
          {detail.condition && <ConditionBadge condition={detail.condition} />}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Progress value={progressPercent} className="h-1.5 flex-1" />
        <span className="text-foreground-tertiary text-xs tabular-nums">{progressPercent}%</span>
      </div>

      <p className="text-foreground-secondary line-clamp-2 text-sm leading-relaxed">
        {isClientRole ? definition.clientDescription : detail.nextAction.action}
      </p>

      <div className="border-border-subtle flex items-center justify-between border-t pt-3">
        {owner ? (
          <span className="text-foreground-tertiary flex items-center gap-1.5 text-xs">
            <UserAvatar name={owner.name} size="sm" className="size-5" />
            {owner.name}
          </span>
        ) : (
          <span />
        )}
        <span className="text-foreground-tertiary text-xs">Updated {formatRelativeTime(detail.updatedAt)}</span>
      </div>
    </motion.button>
  )
}
