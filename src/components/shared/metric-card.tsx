import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  icon?: LucideIcon
  trend?: {
    value: string
    direction: 'up' | 'down'
    /** Whether "up" is good news (e.g. revenue) or bad news (e.g. overdue returns). */
    sentiment?: 'positive' | 'negative'
  }
  className?: string
}

/** KPI tile for dashboards — a label, a large value, and an optional trend. */
export function MetricCard({ label, value, icon: Icon, trend, className }: MetricCardProps) {
  const trendIsGood =
    trend && (trend.sentiment === 'negative' ? trend.direction === 'down' : trend.direction === 'up')

  return (
    <motion.div
      variants={fadeInUp}
      className={cn('bg-surface-raised border-border rounded-xl border p-5 shadow-xs', className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-foreground-secondary text-sm font-medium">{label}</span>
        {Icon && <Icon className="text-foreground-tertiary size-4" aria-hidden="true" />}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="text-foreground text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {trend && (
          <span
            className={cn(
              'mb-0.5 flex items-center gap-0.5 text-xs font-medium',
              trendIsGood ? 'text-success' : 'text-danger'
            )}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="size-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3.5" aria-hidden="true" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  )
}
