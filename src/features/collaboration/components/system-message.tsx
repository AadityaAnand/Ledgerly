import { motion } from 'framer-motion'
import { staggerItem } from '@/lib/animations'
import { formatRelativeTime } from '@/utils/format'

interface SystemMessageProps {
  body: string
  createdAt: string
}

/** A quiet, centered line for system activity — status changes, reminders,
 * requests marked received. Never competes visually with real messages. */
export function SystemMessage({ body, createdAt }: SystemMessageProps) {
  return (
    <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 py-1.5">
      <p className="text-foreground-tertiary text-center text-xs">
        {body} <span className="text-foreground-tertiary/70">· {formatRelativeTime(createdAt)}</span>
      </p>
    </motion.div>
  )
}
