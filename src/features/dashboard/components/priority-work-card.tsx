import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { workItemCategoryMeta } from '@/features/dashboard/work-item-meta'
import { describeDueDate, getDueBucket } from '@/lib/work-priority'
import { getUserById } from '@/mock/users'
import { staggerItem } from '@/lib/animations'
import { taskPriorityMeta } from '@/utils/status'
import { cn } from '@/lib/utils'
import type { WorkItem } from '@/types'

interface PriorityWorkCardProps {
  item: WorkItem
  onOpen: () => void
}

/** The dashboard's most important surface — one card, one reason it
 * matters, one owner, one action. No hunting for what to do next. */
export function PriorityWorkCard({ item, onOpen }: PriorityWorkCardProps) {
  const owner = getUserById(item.ownerId)
  const meta = workItemCategoryMeta[item.category]
  const dueLabel = describeDueDate(item.dueDate)
  const dueBucket = getDueBucket(item.dueDate)

  return (
    <motion.button
      type="button"
      variants={staggerItem}
      onClick={onOpen}
      className="border-border bg-surface-raised hover:border-primary/30 hover:bg-surface-hover focus-visible:-outline-offset-2 flex flex-col gap-3 rounded-2xl border p-5 text-left transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-foreground-tertiary flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <meta.icon className="size-3.5" aria-hidden="true" />
          {meta.label}
        </span>
        <StatusBadge {...taskPriorityMeta[item.priority]} />
      </div>

      <div className="min-w-0">
        {item.clientName && <p className="text-foreground truncate text-base font-semibold">{item.clientName}</p>}
        {item.returnLabel && <p className="text-foreground-tertiary text-xs">{item.returnLabel}</p>}
        <p className="text-foreground-secondary mt-1.5 text-sm leading-relaxed">{item.title}</p>
        <p className="text-foreground-tertiary mt-1 text-xs leading-relaxed">{item.reason}</p>
      </div>

      <div className="border-border-subtle flex items-center justify-between gap-2 border-t pt-3">
        <div className="flex items-center gap-3">
          {owner && (
            <span className="text-foreground-tertiary flex items-center gap-1.5 text-xs">
              <UserAvatar name={owner.name} size="sm" className="size-5" />
              {owner.name}
            </span>
          )}
          {dueLabel && (
            <span
              className={cn(
                'text-xs font-medium',
                dueBucket === 'overdue' || dueBucket === 'today' ? 'text-danger' : 'text-foreground-tertiary'
              )}
            >
              {dueLabel}
            </span>
          )}
        </div>
        <span className="text-primary flex shrink-0 items-center gap-1 text-sm font-medium">
          {item.ctaLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </motion.button>
  )
}
