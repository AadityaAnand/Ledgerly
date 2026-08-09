import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { FieldRow } from './field-row'
import { staggerContainer, staggerItem, transitions } from '@/lib/animations'
import { traceCategoryLabels, verificationStatusMeta } from '@/utils/status'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import type { TaxFieldTrace, TraceCategory, VerificationStatus } from '@/types'

const CATEGORY_ORDER: TraceCategory[] = ['income', 'business', 'deductions', 'credits', 'payments_credits', 'tax_summary']

const STATUS_FILTERS: (VerificationStatus | 'all')[] = ['all', 'needs_review', 'flagged', 'rejected', 'verified', 'unverified', 'overridden']

interface FieldListPanelProps {
  traces: TaxFieldTrace[]
  selectedFieldId: string | null
  onSelect: (id: string) => void
  onHoverChange: (id: string | null) => void
  /** Deep-linked category (e.g. from the Return Overview) — collapses every
   * other category so the user lands exactly where they clicked from. */
  focusCategory?: TraceCategory | null
}

export function FieldListPanel({ traces, selectedFieldId, onSelect, onHoverChange, focusCategory }: FieldListPanelProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all')
  const [expanded, setExpanded] = useState<Set<TraceCategory>>(() => (focusCategory ? new Set([focusCategory]) : new Set(CATEGORY_ORDER)))

  // A category deep link (from Overview or search) should focus that single
  // section — collapse the rest — rather than dumping the user into a wall
  // of 150+ fields with no orientation. Adjusted during render (React's
  // recommended pattern for resetting state from a changed prop) rather
  // than in an effect, to avoid an extra cascading render.
  const [prevFocusCategory, setPrevFocusCategory] = useState(focusCategory)
  if (focusCategory !== prevFocusCategory) {
    setPrevFocusCategory(focusCategory)
    if (focusCategory) setExpanded(new Set([focusCategory]))
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return traces.filter((t) => {
      if (statusFilter !== 'all' && t.verification !== statusFilter) return false
      if (q && !t.label.toLowerCase().includes(q) && !t.formLine.toLowerCase().includes(q)) return false
      return true
    })
  }, [traces, search, statusFilter])

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: filtered.filter((t) => t.category === category),
    })).filter((group) => group.items.length > 0)
  }, [filtered])

  const activeFilterCount = (statusFilter !== 'all' ? 1 : 0) + (search.trim() ? 1 : 0)

  function toggleCategory(category: TraceCategory) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border-subtle bg-surface sticky top-0 z-20 flex flex-col gap-2 border-b p-3">
        <div className="relative">
          <Search className="text-foreground-tertiary pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" aria-hidden="true" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fields…"
            aria-label="Search fields"
            className="h-8 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={cn(
                'h-6 rounded-full px-2.5 text-xs font-medium transition-colors',
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-surface-hover'
              )}
            >
              {status === 'all' ? 'All statuses' : verificationStatusMeta[status].label}
            </button>
          ))}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
              }}
              className="text-foreground-tertiary hover:text-foreground flex h-6 items-center gap-1 rounded-full px-2 text-xs"
            >
              <X className="size-3" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
        <p className="text-foreground-tertiary text-xs tabular-nums">
          {filtered.length} of {traces.length} fields
        </p>
      </div>

      {grouped.length === 0 ? (
        <p className="text-foreground-tertiary px-4 py-10 text-center text-sm">No fields match these filters.</p>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col">
          {grouped.map((group) => {
            const isOpen = expanded.has(group.category)
            return (
              <motion.div key={group.category} variants={staggerItem}>
                <button
                  type="button"
                  onClick={() => toggleCategory(group.category)}
                  aria-expanded={isOpen}
                  className="bg-surface border-border-subtle sticky top-26 z-10 flex w-full items-center justify-between border-b px-4 py-2 text-left"
                >
                  <span className="flex items-center gap-1.5">
                    <ChevronDown
                      className={cn('text-foreground-tertiary size-3.5 transition-transform', !isOpen && '-rotate-90')}
                      aria-hidden="true"
                    />
                    <h3 className="text-foreground-secondary text-xs font-semibold tracking-wide uppercase">
                      {traceCategoryLabels[group.category]}
                    </h3>
                    <span className="text-foreground-tertiary text-xs tabular-nums">({group.items.length})</span>
                  </span>
                  <span className="text-foreground-tertiary text-xs tabular-nums">
                    {formatCurrency(group.items.reduce((sum, item) => sum + item.value, 0))}
                  </span>
                </button>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} transition={transitions.fast} className="overflow-hidden">
                    {group.items.map((trace) => (
                      <FieldRow
                        key={trace.id}
                        trace={trace}
                        isSelected={trace.id === selectedFieldId}
                        onSelect={() => onSelect(trace.id)}
                        onHoverChange={(hovering) => onHoverChange(hovering ? trace.id : null)}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
