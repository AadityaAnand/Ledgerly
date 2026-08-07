import { motion } from 'framer-motion'
import { UserAvatar } from '@/components/shared/user-avatar'

interface TypingIndicatorProps {
  name: string
}

export function TypingIndicator({ name }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-center gap-2.5 px-1 py-2"
    >
      <UserAvatar name={name} size="sm" />
      <div className="bg-surface flex items-center gap-1 rounded-full px-3 py-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="bg-foreground-tertiary size-1.5 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <span className="text-foreground-tertiary text-xs">{name} is typing…</span>
    </motion.div>
  )
}
