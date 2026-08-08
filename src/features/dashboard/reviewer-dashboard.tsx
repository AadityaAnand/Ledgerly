import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle, CheckCircle2, ClipboardCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { SectionHeader } from '@/components/layout/section-header'
import { MetricCard } from '@/components/shared/metric-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { resolveWorkspaceHref } from '@/lib/object-graph'
import { getEffectiveReturnStatus } from '@/lib/return-lifecycle'
import { StageBadge } from '@/features/return-status/components/stage-badge'
import { getClientById } from '@/mock/clients'
import { getReturnById, taxReturns } from '@/mock/returns'
import { taxFieldTraces } from '@/mock/field-traces'
import { aiSuggestions } from '@/mock/ai-suggestions'
import { useActiveRoleUser, useHasPermission } from '@/hooks/use-role'
import { aiSeverityMeta } from '@/utils/status'

export function ReviewerDashboard() {
  const navigate = useNavigate()
  const currentUser = useActiveRoleUser()
  const canApprove = useHasPermission('APPROVE_RETURN')

  const awaitingReview = useMemo(() => taxReturns.filter((r) => r.status === 'in_review'), [])
  const lowConfidenceFields = useMemo(() => taxFieldTraces.filter((t) => t.verification === 'needs_review'), [])
  const exceptions = useMemo(() => taxFieldTraces.filter((t) => t.verification === 'flagged'), [])
  const needsAttention = useMemo(
    () => aiSuggestions.filter((s) => !s.resolved && s.severity !== 'info').slice(0, 5),
    []
  )

  function handleAction(label: string, returnId: string) {
    toast(`${label} — ${getClientById(getReturnById(returnId)?.clientId ?? '')?.name ?? 'return'}`, {
      description: 'This is a foundation build — this action isn’t wired up yet.',
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(' ')[0]}`}
        description="Returns waiting on your review, and where the AI has lower confidence."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard label="Awaiting review" value={String(awaitingReview.length)} icon={ClipboardCheck} />
        <MetricCard label="Low-confidence fields" value={String(lowConfidenceFields.length)} icon={Sparkles} />
        <MetricCard label="Exceptions" value={String(exceptions.length)} icon={AlertTriangle} />
        <MetricCard label="Ready to approve" value={String(awaitingReview.length)} icon={CheckCircle2} />
      </motion.div>

      <div className="flex flex-col gap-4">
        <SectionHeader
          title="Returns awaiting review"
          description="Click a return to open the traceability review"
          actions={
            <Button size="sm" variant="outline" onClick={() => void navigate({ to: '/review-queue' })}>
              View full queue
            </Button>
          }
        />
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
          {awaitingReview.map((r) => {
            const client = getClientById(r.clientId)
            return (
              <motion.div
                key={r.id}
                variants={staggerItem}
                className="bg-surface-raised border-border flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => void navigate({ to: '/returns/$returnId', params: { returnId: r.id } })}
                  className="focus-visible:-outline-offset-2 min-w-0 flex-1 text-left"
                >
                  <p className="text-foreground truncate text-sm font-medium">
                    {client?.name} — {r.formType}
                  </p>
                  <p className="text-foreground-tertiary mt-0.5 text-xs">
                    {r.aiFlagCount} AI flag{r.aiFlagCount === 1 ? '' : 's'} · {r.progress}% complete
                  </p>
                </button>
                <StageBadge stage={getEffectiveReturnStatus(r).stage} />
                {canApprove && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => handleAction('Requested changes', r.id)}>
                      Request changes
                    </Button>
                    <Button size="sm" onClick={() => handleAction('Approved', r.id)}>
                      Approve
                    </Button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeader title="Needs your attention" description="Unresolved AI flags across active returns" />
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
          {needsAttention.map((suggestion) => {
            const taxReturn = getReturnById(suggestion.returnId)
            const client = taxReturn ? getClientById(taxReturn.clientId) : undefined
            return (
              <motion.button
                key={suggestion.id}
                variants={staggerItem}
                type="button"
                onClick={() => void navigate({ to: resolveWorkspaceHref('ai_review', suggestion.id) })}
                className="bg-surface-raised border-border hover:bg-surface-hover focus-visible:-outline-offset-2 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{suggestion.title}</p>
                  <p className="text-foreground-tertiary mt-0.5 truncate text-xs">{client?.name}</p>
                </div>
                <StatusBadge {...aiSeverityMeta[suggestion.severity]} />
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </PageContainer>
  )
}
