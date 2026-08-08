import { AlertOctagon, AlertTriangle, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { ReturnBlocker } from '@/types'

const severityStyles = {
  danger: {
    icon: AlertOctagon,
    className: 'border-danger/20 bg-danger-subtle text-danger-subtle-foreground',
    iconClassName: 'text-danger',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-warning/20 bg-warning-subtle text-warning-subtle-foreground',
    iconClassName: 'text-warning',
  },
  info: {
    icon: Info,
    className: 'border-ai/20 bg-ai-subtle text-ai-subtle-foreground',
    iconClassName: 'text-ai',
  },
} as const

interface BlockerBannerProps {
  blocker: ReturnBlocker
  className?: string
}

/** A calm, severity-appropriate callout — not every blocker is styled like
 * an error. Only `danger` gets the strongest treatment. */
export function BlockerBanner({ blocker, className }: BlockerBannerProps) {
  const styles = severityStyles[blocker.severity]
  const Icon = styles.icon

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      role="status"
      className={cn('flex items-start gap-3 rounded-xl border px-4 py-3', styles.className, className)}
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', styles.iconClassName)} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-medium">{blocker.reason}</p>
        {blocker.detail && <p className="mt-0.5 text-sm leading-relaxed opacity-90">{blocker.detail}</p>}
      </div>
    </motion.div>
  )
}
