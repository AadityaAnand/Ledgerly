import { motion } from 'framer-motion'
import { transitions } from '@/lib/animations'
import { getConfidenceLevel } from '@/utils/status'
import { cn } from '@/lib/utils'
import type { ConfidenceLevel } from '@/types'

const sizeConfig = {
  sm: { box: 20, stroke: 2.5, showLabel: false, fontSize: '' },
  md: { box: 40, stroke: 3.5, showLabel: true, fontSize: 'text-xs' },
  lg: { box: 64, stroke: 4.5, showLabel: true, fontSize: 'text-base' },
} as const

const levelStrokeClass: Record<ConfidenceLevel, string> = {
  high: 'stroke-success',
  medium: 'stroke-warning',
  low: 'stroke-danger',
}

interface ConfidenceMeterProps {
  score: number
  size?: keyof typeof sizeConfig
  className?: string
}

/** Radial confidence indicator. Compact (`sm`) for list rows, larger
 * variants show the percentage for the inspector header. */
export function ConfidenceMeter({ score, size = 'md', className }: ConfidenceMeterProps) {
  const level = getConfidenceLevel(score)
  const { box, stroke, showLabel, fontSize } = sizeConfig[size]
  const radius = (box - stroke) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: box, height: box }}
      role="img"
      aria-label={`${score}% confidence`}
    >
      <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} className="-rotate-90">
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <motion.circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={levelStrokeClass[level]}
          style={{ strokeDasharray: circumference }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={transitions.slow}
        />
      </svg>
      {showLabel && (
        <span className={cn('text-foreground absolute font-semibold tabular-nums', fontSize)}>{score}</span>
      )}
    </div>
  )
}
