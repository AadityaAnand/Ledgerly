import { useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, FileQuestion, FileStack, FileText, ListChecks, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Progress } from '@/components/ui/progress'
import { StageBadge } from '@/features/return-status/components/stage-badge'
import { ReturnWorkspaceNav } from '@/features/return-workspace/components/return-workspace-nav'
import { getReturnIssues, getReturnWorkspaceStats } from '@/features/return-workspace/lib/return-workspace-data'
import { AISummaryCard } from '@/features/ai-review/components/ai-summary-card'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { getEffectiveReturnStatus } from '@/lib/return-lifecycle'
import { useNavigationStore } from '@/store/navigation-store'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

const severityDot: Record<string, string> = {
  critical: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-foreground-tertiary',
}

/** The top-level entry point into a complex return: orientation before drill-down.
 * Every number here is a link — clicking "Income · 34 fields" doesn't dump the
 * user into all 190 fields, it opens Fields pre-focused on that one category. */
export function ReturnOverviewPage() {
  const { returnId } = useParams({ strict: false }) as { returnId?: string }
  const navigate = useNavigate()
  const taxReturn = returnId ? getReturnById(returnId) : undefined
  const client = taxReturn ? getClientById(taxReturn.clientId) : undefined
  const visit = useNavigationStore((s) => s.visit)

  useEffect(() => {
    if (!client || !taxReturn) return
    visit(
      { type: 'return', id: taxReturn.id, label: `${client.name} — Overview`, href: `/returns/${taxReturn.id}/overview` },
      { returnId: taxReturn.id, clientId: client.id, status: taxReturn.status }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxReturn?.id, client?.id])

  if (!taxReturn || !client) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <EmptyState icon={FileQuestion} title="Return not found" description="This return doesn’t exist in this preview build." />
      </div>
    )
  }

  const stats = getReturnWorkspaceStats(taxReturn.id)
  const issues = getReturnIssues(taxReturn.id)
  const stage = getEffectiveReturnStatus(taxReturn).stage

  const summaryCards = [
    { label: 'Documents', value: stats.documentsTotal, hint: `${stats.documentsNeedingAttention} need attention`, icon: FileText, href: `/returns/${taxReturn.id}/documents` },
    { label: 'Tax fields', value: stats.fieldsTotal, hint: `${stats.fieldsOpen} open`, icon: FileStack, href: `/returns/${taxReturn.id}` },
    { label: 'Open issues', value: stats.issuesCount, hint: 'Fields & tasks needing action', icon: AlertTriangle, href: `/returns/${taxReturn.id}/issues` },
    { label: 'AI findings', value: stats.aiFindingsCount, hint: 'Low confidence, conflicts & more', icon: Sparkles, href: `/returns/${taxReturn.id}/ai-findings` },
  ]

  return (
    <div className="flex h-full flex-col">
      <ReturnWorkspaceNav returnId={taxReturn.id} issuesCount={stats.issuesCount} aiFindingsCount={stats.aiFindingsCount} />
      <ScrollArea className="min-h-0 flex-1">
        <PageContainer>
          <PageHeader
            title={`${client.name} — ${taxReturn.taxYear} ${taxReturn.formType}`}
            description={`Return overview · assigned to review by ${stage === 'client_review' ? 'client' : 'CPA'}`}
            actions={<StageBadge stage={stage} />}
          />

          <div className="border-border bg-surface-raised flex items-center gap-4 rounded-xl border p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary text-sm font-medium">Overall progress</span>
                <span className="text-foreground-tertiary text-sm tabular-nums">{taxReturn.progress}%</span>
              </div>
              <Progress value={taxReturn.progress} className="mt-2 h-2" />
            </div>
            <StatusBadge label={`${taxReturn.formType} · Tax year ${taxReturn.taxYear}`} tone="neutral" />
          </div>

          <AISummaryCard returnId={taxReturn.id} />

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <motion.button
                key={card.label}
                variants={staggerItem}
                type="button"
                onClick={() => void navigate({ to: card.href })}
                className="border-border bg-surface-raised hover:border-primary/40 hover:bg-surface-hover flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors"
              >
                <card.icon className="text-foreground-tertiary size-4" aria-hidden="true" />
                <span className="text-foreground text-2xl font-semibold tabular-nums">{card.value}</span>
                <span className="text-foreground-secondary text-sm">{card.label}</span>
                <span className="text-foreground-tertiary text-xs">{card.hint}</span>
              </motion.button>
            ))}
          </motion.div>

          <section className="flex flex-col gap-3">
            <h2 className="text-foreground text-sm font-semibold">Categories</h2>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
              {stats.categories.map((cat) => (
                <motion.button
                  key={cat.category}
                  variants={staggerItem}
                  type="button"
                  onClick={() => void navigate({ to: `/returns/${taxReturn.id}?category=${cat.category}` })}
                  className="border-border-subtle bg-surface hover:border-primary/40 hover:bg-surface-hover flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-colors"
                >
                  <span className="flex flex-col">
                    <span className="text-foreground text-sm font-medium">{cat.label}</span>
                    <span className="text-foreground-tertiary text-xs tabular-nums">{cat.count} fields</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {cat.openCount > 0 && (
                      <span className="bg-warning-subtle text-warning-subtle-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs tabular-nums">
                        {cat.openCount}
                      </span>
                    )}
                    <ArrowRight className="text-foreground-tertiary size-3.5" aria-hidden="true" />
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-sm font-semibold">Needs attention</h2>
              <button
                type="button"
                onClick={() => void navigate({ to: `/returns/${taxReturn.id}/issues` })}
                className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
              >
                View all issues
                <ArrowRight className="size-3" aria-hidden="true" />
              </button>
            </div>
            {issues.length === 0 ? (
              <EmptyState icon={ListChecks} title="Nothing needs attention" description="Every field and task on this return is in good shape." />
            ) : (
              <motion.ul variants={fadeInUp} initial="hidden" animate="visible" className="border-border-subtle divide-border-subtle divide-y rounded-xl border">
                {issues.slice(0, 6).map((issue) => (
                  <li key={issue.id}>
                    <button
                      type="button"
                      onClick={() => void navigate({ to: issue.href })}
                      className="hover:bg-surface-hover flex w-full items-center gap-3 px-4 py-2.5 text-left"
                    >
                      <span className={cn('size-1.5 shrink-0 rounded-full', severityDot[issue.severity])} aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate text-sm">{issue.title}</span>
                      <span className="text-foreground-tertiary shrink-0 text-xs">{issue.statusLabel}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </section>
        </PageContainer>
      </ScrollArea>
    </div>
  )
}
