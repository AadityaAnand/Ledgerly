import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowRight, FileQuestion, Search, Sparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { ConfidenceIndicator } from '@/components/shared/field-affordance'
import { ReturnWorkspaceNav } from '@/features/return-workspace/components/return-workspace-nav'
import { getReturnAIFindings, getReturnIssues, type AIFindingType } from '@/features/return-workspace/lib/return-workspace-data'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { useNavigationStore } from '@/store/navigation-store'
import { traceCategoryLabels } from '@/utils/status'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

const typeLabels: Record<AIFindingType, string> = {
  low_confidence: 'Low confidence',
  conflict: 'Possible mismatch',
  needs_review: 'Needs review',
  suggested_correction: 'Suggested correction',
}

const TYPE_FILTERS: (AIFindingType | 'all')[] = ['all', 'low_confidence', 'conflict', 'suggested_correction']

/** Every AI-surfaced finding for a return, in one filterable layer, so the
 * user reviews "what did the AI flag" as its own concern rather than
 * hunting through 190 field rows for the handful the AI is unsure about. */
export function ReturnAIFindingsPage() {
  const { returnId } = useParams({ strict: false }) as { returnId?: string }
  const navigate = useNavigate()
  const taxReturn = returnId ? getReturnById(returnId) : undefined
  const client = taxReturn ? getClientById(taxReturn.clientId) : undefined
  const visit = useNavigationStore((s) => s.visit)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AIFindingType | 'all'>('all')

  useEffect(() => {
    if (!client || !taxReturn) return
    visit(
      { type: 'return', id: taxReturn.id, label: `${client.name} — AI Findings`, href: `/returns/${taxReturn.id}/ai-findings` },
      { returnId: taxReturn.id, clientId: client.id, status: taxReturn.status }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxReturn?.id, client?.id])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allFindings = useMemo(() => (taxReturn ? getReturnAIFindings(taxReturn.id) : []), [taxReturn?.id])
  const issuesCount = taxReturn ? getReturnIssues(taxReturn.id).length : 0

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allFindings
      .filter((f) => (typeFilter === 'all' ? true : f.type === typeFilter))
      .filter((f) => (q ? f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) : true))
  }, [allFindings, search, typeFilter])

  if (!taxReturn || !client) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <EmptyState icon={FileQuestion} title="Return not found" description="This return doesn’t exist in this preview build." />
      </div>
    )
  }

  const hasActiveFilters = search.trim() !== '' || typeFilter !== 'all'

  return (
    <div className="flex h-full flex-col">
      <ReturnWorkspaceNav returnId={taxReturn.id} issuesCount={issuesCount} aiFindingsCount={allFindings.length} />
      <ScrollArea className="min-h-0 flex-1">
        <PageContainer>
          <PageHeader
            title="AI Findings"
            description="Everything Ledgerly's AI flagged on this return — low-confidence reads, conflicts, and suggested corrections."
            actions={
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void navigate({ to: `/ai-review?returnId=${taxReturn.id}` })}>
                Open in AI Review
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Button>
            }
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="text-foreground-tertiary pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" aria-hidden="true" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search findings…"
                aria-label="Search AI findings"
                className="h-8 pl-8 text-sm"
              />
            </div>
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                aria-pressed={typeFilter === t}
                className={cn(
                  'h-8 rounded-full px-3 text-xs font-medium transition-colors',
                  typeFilter === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-surface-hover'
                )}
              >
                {t === 'all' ? 'All findings' : typeLabels[t]}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setTypeFilter('all')
                }}
                className="text-foreground-tertiary hover:text-foreground flex h-8 items-center gap-1 rounded-full px-2 text-xs"
              >
                <X className="size-3" aria-hidden="true" />
                Clear filters
              </button>
            )}
            <span className="text-foreground-tertiary ml-auto text-xs tabular-nums">
              {filtered.length} of {allFindings.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title={allFindings.length === 0 ? 'No AI findings' : 'No findings match these filters'}
              description={
                allFindings.length === 0
                  ? 'Ledgerly’s AI hasn’t flagged anything on this return right now.'
                  : 'Try a different search term or clear the filters above.'
              }
            />
          ) : (
            <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="border-border-subtle divide-border-subtle divide-y rounded-xl border">
              {filtered.map((finding) => (
                <motion.li key={finding.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => void navigate({ to: finding.href })}
                    className="hover:bg-surface-hover flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <Sparkles className="text-ai size-4 shrink-0" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground truncate text-sm font-medium">{finding.title}</span>
                        <span className="bg-ai-subtle text-ai-subtle-foreground shrink-0 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium">
                          {typeLabels[finding.type]}
                        </span>
                      </div>
                      <p className="text-foreground-secondary mt-0.5 line-clamp-1 text-xs">{finding.description}</p>
                      <p className="text-foreground-tertiary mt-1 text-xs">{traceCategoryLabels[finding.category]}</p>
                    </div>
                    <ConfidenceIndicator score={finding.confidence} size="sm" />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </PageContainer>
      </ScrollArea>
    </div>
  )
}
