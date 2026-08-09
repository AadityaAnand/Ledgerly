import { useNavigate } from '@tanstack/react-router'
import { CheckCircle2, Inbox } from 'lucide-react'
import { motion } from 'framer-motion'
import { StageBadge, ConditionBadge } from './stage-badge'
import { StageTimeline } from './stage-timeline'
import { ReturnNextActionCard } from './return-next-action-card'
import { BlockerBanner } from './blocker-banner'
import { Timeline } from '@/components/shared/timeline'
import { EmptyState } from '@/components/shared/empty-state'
import { PropertyList } from '@/components/shared/property-list'
import { StatusBadge } from '@/components/shared/status-badge'
import { fadeIn, staggerContainer, staggerItem } from '@/lib/animations'
import { getEffectiveReturnStatus, getStageDefinition, TOTAL_ACTIVE_STEPS } from '@/lib/return-lifecycle'
import { resolveWorkspaceHref } from '@/lib/object-graph'
import { getClientById } from '@/mock/clients'
import { getUserById } from '@/mock/users'
import { getConversationsByReturnId } from '@/mock/conversations'
import { conversationMessages } from '@/mock/conversation-messages'
import { useActiveRole, useActiveRoleUser } from '@/hooks/use-role'
import { documentRequestStatusMeta } from '@/utils/status'
import { formatDate, formatRelativeTime } from '@/utils/format'
import type { TaxReturn } from '@/types'

interface ReturnStatusPanelProps {
  taxReturn: TaxReturn
}

/** The one Return Status experience — used by both clients and staff. The
 * data and lifecycle are identical either way; only how much detail is
 * exposed changes, based on the active role. */
export function ReturnStatusPanel({ taxReturn }: ReturnStatusPanelProps) {
  const navigate = useNavigate()
  const role = useActiveRole()
  const activeUser = useActiveRoleUser()
  const isClientRole = role === 'CLIENT' || role === 'BUSINESS_OWNER'

  const detail = getEffectiveReturnStatus(taxReturn)
  const definition = getStageDefinition(detail.stage)
  const client = getClientById(taxReturn.clientId)
  const isFiled = detail.stage === 'filed'

  const owner = getUserById(detail.nextAction.ownerId)
  const ownerLabel = owner ? (owner.id === activeUser.id ? 'You' : owner.name) : 'Unassigned'

  const outstandingRequests = !isClientRole
    ? getConversationsByReturnId(taxReturn.id).flatMap((c) =>
        conversationMessages.filter(
          (m) => m.conversationId === c.id && m.kind === 'document_request' && m.documentRequest?.status !== 'received'
        )
      )
    : []

  function handleNavigate() {
    const { ctaHref, ctaType, ctaId } = detail.nextAction
    if (ctaHref) {
      void navigate({ to: ctaHref })
    } else if (ctaType && ctaId) {
      void navigate({ to: resolveWorkspaceHref(ctaType, ctaId) })
    }
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StageBadge stage={detail.stage} />
          {detail.condition && <ConditionBadge condition={detail.condition} />}
        </div>
        <div>
          <h2 className="text-foreground text-xl font-semibold text-balance">
            {isClientRole ? definition.clientDescription : definition.label}
          </h2>
          <p className="text-foreground-tertiary mt-1 text-sm">
            {isFiled ? 'Complete' : `Step ${definition.position} of ${TOTAL_ACTIVE_STEPS}`}
          </p>
        </div>
      </div>

      {detail.blocker && <BlockerBanner blocker={detail.blocker} />}

      <ReturnNextActionCard
        nextAction={detail.nextAction}
        ownerLabel={ownerLabel}
        ownerAvatarUrl={owner?.avatarUrl}
        isComplete={isFiled}
        onNavigate={detail.nextAction.ctaHref || (detail.nextAction.ctaType && detail.nextAction.ctaId) ? handleNavigate : undefined}
      />

      <div>
        <p className="text-foreground-tertiary mb-3 text-xs font-semibold tracking-wide uppercase">Progress</p>
        <StageTimeline taxReturn={taxReturn} detail={detail} />
      </div>

      {!isClientRole && (
        <>
          <div className="border-border-subtle rounded-xl border px-4">
            <PropertyList
              items={[
                { label: 'Client', value: client?.name ?? '—' },
                { label: 'Assigned to', value: owner?.name ?? 'Unassigned' },
                { label: 'Due', value: detail.nextAction.dueDate ? formatDate(detail.nextAction.dueDate) : '—' },
                { label: 'Last updated', value: formatRelativeTime(detail.updatedAt) },
              ]}
            />
          </div>

          {outstandingRequests.length > 0 && (
            <div>
              <p className="text-foreground-tertiary mb-2 text-xs font-semibold tracking-wide uppercase">
                Outstanding requests
              </p>
              <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-1.5">
                {outstandingRequests.map((message) => (
                  <motion.li
                    key={message.id}
                    variants={staggerItem}
                    className="border-border-subtle flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    <span className="text-foreground truncate">{message.documentRequest?.documentName}</span>
                    {message.documentRequest && (
                      <StatusBadge {...documentRequestStatusMeta[message.documentRequest.status]} className="shrink-0" />
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}

          <div>
            <p className="text-foreground-tertiary mb-3 text-xs font-semibold tracking-wide uppercase">
              Recent activity
            </p>
            {detail.activity.length === 0 ? (
              <EmptyState icon={Inbox} title="No activity yet" className="py-6" />
            ) : (
              <Timeline items={[...detail.activity].reverse()} />
            )}
          </div>
        </>
      )}

      {isFiled && isClientRole && (
        <div className="border-success/20 bg-success-subtle/40 flex items-center gap-3 rounded-xl border px-4 py-3">
          <CheckCircle2 className="text-success size-5 shrink-0" aria-hidden="true" />
          <p className="text-sm">Your return has been filed. We’ll let you know if the IRS needs anything further.</p>
        </div>
      )}
    </motion.div>
  )
}
