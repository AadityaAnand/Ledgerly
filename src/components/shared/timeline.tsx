import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { UserAvatar } from '@/components/shared/user-avatar'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/lib/utils'

export interface TimelineItem {
  id: string
  actorName: string
  actorAvatarUrl?: string
  action: string
  timestamp: string
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

/** Vertical activity timeline — used for return history, client activity, etc. */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <motion.ol
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-col', className)}
    >
      {items.map((item, index) => (
        <motion.li key={item.id} variants={staggerItem} className="relative flex gap-3 pb-6 last:pb-0">
          {index < items.length - 1 && (
            <span className="bg-border absolute top-8 left-3.5 h-[calc(100%-2rem)] w-px" aria-hidden="true" />
          )}
          <UserAvatar name={item.actorName} avatarUrl={item.actorAvatarUrl} size="sm" className="mt-0.5" />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-foreground text-sm">
              <span className="font-medium">{item.actorName}</span>{' '}
              <span className="text-foreground-secondary">{item.action}</span>
            </p>
            <time dateTime={item.timestamp} className="text-foreground-tertiary text-xs">
              {formatRelativeTime(item.timestamp)}
            </time>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}
