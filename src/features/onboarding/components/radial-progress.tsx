import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface RadialProgressProps {
  percent: number
  size?: number
  strokeWidth?: number
  className?: string
  children?: ReactNode
}

/** Circular progress ring used in the onboarding hero — animates its sweep
 * whenever `percent` changes so completing a step visibly moves the needle. */
export function RadialProgress({ percent, size = 88, strokeWidth = 7, className, children }: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(100, Math.max(0, percent)) / 100)

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-primary/15"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-primary"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={transitions.slow}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
