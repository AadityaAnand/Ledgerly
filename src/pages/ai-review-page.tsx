import { useEffect, useMemo, useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { Search, Sparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { AIFindingCard } from '@/features/ai-review/components/ai-finding-card'
import { AIFindingDetailPanel } from '@/features/ai-review/components/ai-finding-detail-panel'
import { aiFindingCategoryMeta, aiFindingSeverityMeta, isHighConfidence } from '@/features/ai-review/lib/ai-status'
import { useAIReviewStore } from '@/store/ai-review-store'
import { getReturnById } from '@/mock/returns'
import { getClientById } from '@/mock/clients'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { staggerContainer } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { AIFindingCategory, AIFindingSeverity } from '@/types'

const CATEGORY_FILTERS: (AIFindingCategory | 'all')[] = [
  'all',
  'extraction',
  'discrepancy',
  'duplicate_document',
  'missing_document',
  'unusual_deduction',
  'conflicting_values',
  'suggested_correction',
  'calculation_issue',
]

const SEVERITY_FILTERS: (AIFindingSeverity | 'all')[] = ['all', 'critical', 'warning', 'info']

/**
 * The dedicated AI Review workspace: a clean, filterable queue on the left,
 * full evidence/confidence/correction detail on the right — never a chat
 * interface. Every finding is a normalized AI response (see
 * `mock/ai-findings.ts`), combining hand-authored flagship examples,
 * `AISuggestion` records, and generated field-trace findings, so the
 * workspace never feels disconnected from the rest of the app.
 */
export function AIReviewPage() {
  const search = useSearch({ strict: false }) as { finding?: string; returnId?: string }
  const findings = useAIReviewStore((s) => s.findings)
  const selectedFindingId = useAIReviewStore((s) => s.selectedFindingId)
  const selectFinding = useAIReviewStore((s) => s.selectFinding)

  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<AIFindingCategory | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<AIFindingSeverity | 'all'>('all')
  const [returnFilter, setReturnFilter] = useState<string | 'all'>(search.returnId ?? 'all')
  const debouncedQuery = useDebouncedValue(query, 200)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 550)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (search.finding) selectFinding(search.finding)
  }, [search.finding, selectFinding])

  const returnOptions = useMemo(() => {
    const ids = Array.from(new Set(findings.map((f) => f.returnId)))
    return ids
      .map((id) => {
        const r = getReturnById(id)
        const client = r ? getClientById(r.clientId) : undefined
        return r && client ? { id, label: `${client.name} — ${r.taxYear} ${r.formType}` } : null
      })
      .filter((v): v is { id: string; label: string } => v !== null)
  }, [findings])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return findings
      .filter((f) => (categoryFilter === 'all' ? true : f.category === categoryFilter))
      .filter((f) => (severityFilter === 'all' ? true : f.severity === severityFilter))
      .filter((f) => (returnFilter === 'all' ? true : f.returnId === returnFilter))
      .filter((f) => (q ? f.title.toLowerCase().includes(q) || f.explanation.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        const rank = (f: typeof a) => (f.severity === 'critical' ? 0 : f.severity === 'warning' ? 1 : 2)
        return rank(a) - rank(b) || (a.createdAt < b.createdAt ? 1 : -1)
      })
  }, [findings, debouncedQuery, categoryFilter, severityFilter, returnFilter])

  const selected = findings.find((f) => f.id === selectedFindingId) ?? null

  const analyzed = findings.length
  const highConfidence = findings.filter((f) => isHighConfidence(f.confidence)).length
  const needsReview = findings.filter((f) => f.status === 'needs_review').length
  const potentialIssues = findings.filter((f) => f.severity === 'critical').length

  const hasActiveFilters = query.trim() !== '' || categoryFilter !== 'all' || severityFilter !== 'all' || returnFilter !== 'all'

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex shrink-0 flex-col gap-3 border-b px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="bg-ai-subtle text-ai-subtle-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-foreground text-sm font-semibold">AI Review</h1>
            <p className="text-foreground-tertiary text-xs">
              {analyzed} analyzed · {highConfidence} high confidence · {needsReview} need review · {potentialIssues} potential issues
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-56">
            <Search className="text-foreground-tertiary pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search findings…"
              aria-label="Search AI findings"
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
              {s === 'all' ? 'All severities' : aiFindingSeverityMeta[s].label}
            </button>
          ))}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as AIFindingCategory | 'all')}
            aria-label="Filter by category"
            className="border-border bg-background text-foreground h-8 rounded-full border px-3 text-xs font-medium"
          >
            <option value="all">All categories</option>
            {CATEGORY_FILTERS.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>
                {aiFindingCategoryMeta[c].label}
              </option>
            ))}
          </select>
          <select
            value={returnFilter}
            onChange={(e) => setReturnFilter(e.target.value)}
            aria-label="Filter by return"
            className="border-border bg-background text-foreground h-8 max-w-52 rounded-full border px-3 text-xs font-medium"
          >
            <option value="all">All returns</option>
            {returnOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategoryFilter('all')
                setSeverityFilter('all')
                setReturnFilter('all')
              }}
              className="text-foreground-tertiary hover:text-foreground flex h-8 items-center gap-1 rounded-full px-2 text-xs"
            >
              <X className="size-3" aria-hidden="true" />
              Clear filters
            </button>
          )}
          <span className="text-foreground-tertiary ml-auto text-xs tabular-nums">
            {filtered.length} of {analyzed}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full">
            <div className="border-border flex w-[38%] min-w-0 flex-col gap-3 border-r p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Sparkles className="text-ai size-5 animate-pulse" aria-hidden="true" />
                <p className="text-foreground-tertiary text-sm">Analyzing findings…</p>
              </div>
            </div>
          </div>
        ) : analyzed === 0 ? (
          <EmptyState icon={Sparkles} title="No AI findings" description="Nothing has been analyzed yet." className="h-full" />
        ) : (
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel defaultSize="38" minSize="28">
              <ScrollArea className="h-full">
                {filtered.length === 0 ? (
                  <EmptyState icon={Search} title="No findings match these filters" description="Try a different search term or clear the filters above." className="h-full" />
                ) : (
                  <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="divide-border-subtle flex flex-col divide-y">
                    {filtered.map((finding) => (
                      <AIFindingCard
                        key={finding.id}
                        finding={finding}
                        isSelected={finding.id === selectedFindingId}
                        onSelect={() => selectFinding(finding.id)}
                      />
                    ))}
                  </motion.ul>
                )}
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="62" minSize="36">
              <AIFindingDetailPanel finding={selected} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}
