import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

/** Large page title used once at the top of every route. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn('flex items-start justify-between gap-6', className)}
    >
      <div className="min-w-0">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {description && (
          <p className="text-foreground-secondary mt-1.5 max-w-2xl text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </motion.div>
  )
}
