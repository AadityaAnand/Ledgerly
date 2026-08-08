import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { EmptyState } from '@/components/shared/empty-state'
import { CalendarCheck } from 'lucide-react'
import { getDueBucket } from '@/lib/work-priority'
import { staggerContainer, staggerItem } from '@/lib/animations'
import type { WorkItem } from '@/types'

interface DeadlinesStripProps {
  items: WorkItem[]
}

const GROUPS: { key: 'today' | 'tomorrow' | 'week'; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'week', label: 'This Week' },
]

const ITEMS_PER_GROUP = 4

/** Awareness, not scheduling — three compact groups, a handful of items
 * each, no calendar grid. */
export function DeadlinesStrip({ items }: DeadlinesStripProps) {
  const navigate = useNavigate()

  const grouped = useMemo(
    () =>
      GROUPS.map((group) => ({
        ...group,
        items: items
          .filter((item) => getDueBucket(item.dueDate) === group.key)
          .sort((a, b) => b.score - a.score)
          .slice(0, ITEMS_PER_GROUP),
      })),
    [items]
  )

  const hasAny = grouped.some((g) => g.items.length > 0)

  if (!hasAny) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="Nothing due this week"
        description="No deadlines to keep an eye on right now."
        className="py-8"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {grouped.map((group) => (
        <div key={group.key} className="flex flex-col gap-2">
          <p className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">
            {group.label} <span className="tabular-nums">({group.items.length})</span>
          </p>
          {group.items.length === 0 ? (
            <p className="text-foreground-tertiary text-xs">Nothing here.</p>
          ) : (
            <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-1.5">
              {group.items.map((item) => (
                <motion.li key={item.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => void navigate({ to: item.ctaHref })}
                    className="border-border-subtle hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full flex-col gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors"
                  >
                    <span className="text-foreground truncate text-sm font-medium">{item.clientName ?? item.title}</span>
                    <span className="text-foreground-tertiary truncate text-xs">{item.title}</span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      ))}
    </div>
  )
}
