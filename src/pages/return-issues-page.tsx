import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { AlertTriangle, FileQuestion, ListChecks, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/shared/empty-state'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { ReturnWorkspaceNav } from '@/features/return-workspace/components/return-workspace-nav'
import { getReturnAIFindings, getReturnIssues, type IssueSeverity } from '@/features/return-workspace/lib/return-workspace-data'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { getUserById } from '@/mock/users'
import { useNavigationStore } from '@/store/navigation-store'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

const severityMeta: Record<IssueSeverity, { label: string; dot: string; badge: string }> = {
  critical: { label: 'Critical', dot: 'bg-danger', badge: 'bg-danger-subtle text-danger-subtle-foreground' },
  warning: { label: 'Warning', dot: 'bg-warning', badge: 'bg-warning-subtle text-warning-subtle-foreground' },
  info: { label: 'Info', dot: 'bg-foreground-tertiary', badge: 'bg-muted text-muted-foreground' },
}

const SEVERITY_FILTERS: (IssueSeverity | 'all')[] = ['all', 'critical', 'warning', 'info']
const KIND_FILTERS: ('all' | 'field' | 'task')[] = ['all', 'field', 'task']

/** The review queue for a single return, at field-and-task granularity —
 * every low-confidence extraction, conflict, and open task in one place,
 * each one a direct deep link back into its own context. */
export function ReturnIssuesPage() {
  const { returnId } = useParams({ strict: false }) as { returnId?: string }
  const navigate = useNavigate()
  const taxReturn = returnId ? getReturnById(returnId) : undefined
  const client = taxReturn ? getClientById(taxReturn.clientId) : undefined
  const visit = useNavigationStore((s) => s.visit)

  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all')
  const [kindFilter, setKindFilter] = useState<'all' | 'field' | 'task'>('all')

  useEffect(() => {
    if (!client || !taxReturn) return
    visit(
      { type: 'return', id: taxReturn.id, label: `${client.name} — Issues`, href: `/returns/${taxReturn.id}/issues` },
      { returnId: taxReturn.id, clientId: client.id, status: taxReturn.status }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxReturn?.id, client?.id])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allIssues = useMemo(() => (taxReturn ? getReturnIssues(taxReturn.id) : []), [taxReturn?.id])
  const aiFindingsCount = taxReturn ? getReturnAIFindings(taxReturn.id).length : 0

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allIssues
      .filter((i) => (severityFilter === 'all' ? true : i.severity === severityFilter))
      .filter((i) => (kindFilter === 'all' ? true : i.kind === kindFilter))
      .filter((i) => (q ? i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) : true))
  }, [allIssues, search, severityFilter, kindFilter])

  if (!taxReturn || !client) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <EmptyState icon={FileQuestion} title="Return not found" description="This return doesn’t exist." />
      </div>
    )
  }

  const hasActiveFilters = search.trim() !== '' || severityFilter !== 'all' || kindFilter !== 'all'

  return (
    <div className="flex h-full flex-col">
      <ReturnWorkspaceNav returnId={taxReturn.id} issuesCount={allIssues.length} aiFindingsCount={aiFindingsCount} />
      <ScrollArea className="min-h-0 flex-1">
        <PageContainer>
          <PageHeader
            title="Issues"
            description="Everything on this return that needs a decision — low-confidence extractions, conflicts, and open tasks."
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="text-foreground-tertiary pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" aria-hidden="true" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search issues…"
                aria-label="Search issues"
                className="h-8 pl-8 text-sm"
              />
            </div>
            {SEVERITY_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeverityFilter(s)}
                aria-pressed={severityFilter === s}
                className={cn(
                  'h-8 rounded-full px-3 text-xs font-medium transition-colors',
                  severityFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-surface-hover'
                )}
              >
                {s === 'all' ? 'All severities' : severityMeta[s].label}
              </button>
            ))}
            {KIND_FILTERS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKindFilter(k)}
                aria-pressed={kindFilter === k}
                className={cn(
                  'h-8 rounded-full px-3 text-xs font-medium transition-colors',
                  kindFilter === k ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-surface-hover'
                )}
              >
                {k === 'all' ? 'Fields & tasks' : k === 'field' ? 'Fields' : 'Tasks'}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSeverityFilter('all')
                  setKindFilter('all')
                }}
                className="text-foreground-tertiary hover:text-foreground flex h-8 items-center gap-1 rounded-full px-2 text-xs"
              >
                <X className="size-3" aria-hidden="true" />
                Clear filters
              </button>
            )}
            <span className="text-foreground-tertiary ml-auto text-xs tabular-nums">
              {filtered.length} of {allIssues.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={allIssues.length === 0 ? ListChecks : AlertTriangle}
              title={allIssues.length === 0 ? 'No open issues' : 'No issues match these filters'}
              description={
                allIssues.length === 0
                  ? 'Every field and task on this return is resolved.'
                  : 'Try a different search term or clear the filters above.'
              }
            />
          ) : (
            <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="border-border-subtle divide-border-subtle divide-y rounded-xl border">
              {filtered.map((issue) => {
                const owner = issue.ownerId ? getUserById(issue.ownerId) : undefined
                return (
                  <motion.li key={issue.id} variants={staggerItem}>
                    <button
                      type="button"
                      onClick={() => void navigate({ to: issue.href })}
                      className="hover:bg-surface-hover flex w-full items-start gap-3 px-4 py-3 text-left"
                    >
                      <span className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', severityMeta[issue.severity].dot)} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground truncate text-sm font-medium">{issue.title}</span>
                          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium', severityMeta[issue.severity].badge)}>
                            {severityMeta[issue.severity].label}
                          </span>
                        </div>
                        <p className="text-foreground-secondary mt-0.5 line-clamp-1 text-xs">{issue.description}</p>
                        <p className="text-foreground-tertiary mt-1 text-xs">
                          {issue.statusLabel}
                          {owner ? ` · Owner: ${owner.name}` : ''} · {issue.nextAction}
                        </p>
                      </div>
                    </button>
                  </motion.li>
                )
              })}
            </motion.ul>
          )}
        </PageContainer>
      </ScrollArea>
    </div>
  )
}
