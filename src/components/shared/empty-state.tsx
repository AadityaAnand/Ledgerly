import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/** Calm, centered placeholder for lists/pages with nothing in them yet. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center', className)}
    >
      <div className="bg-surface flex size-12 items-center justify-center rounded-full">
        <Icon className="text-foreground-tertiary size-5" aria-hidden="true" />
      </div>
      <h3 className="text-foreground mt-4 text-sm font-semibold">{title}</h3>
      {description && (
        <p className="text-foreground-secondary mt-1.5 max-w-sm text-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
