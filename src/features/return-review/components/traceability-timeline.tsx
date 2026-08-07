import {
  Calculator,
  CheckCircle2,
  Cog,
  Eye,
  Flag,
  FileSearch,
  Gauge,
  Pencil,
  UploadCloud,
  Wand2,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { formatDate, formatRelativeTime } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { TimelineEventType, TraceabilityTimelineEvent } from '@/types'

const eventIcon: Record<TimelineEventType, LucideIcon> = {
  uploaded: UploadCloud,
  processing: Cog,
  extracted: FileSearch,
  normalized: Wand2,
  calculated: Calculator,
  confidence_scored: Gauge,
  review_started: Eye,
  approved: CheckCircle2,
  flagged: Flag,
  edited: Pencil,
  rejected: XCircle,
}

const eventTone: Record<TimelineEventType, string> = {
  uploaded: 'bg-ai-subtle text-ai-subtle-foreground',
  processing: 'bg-ai-subtle text-ai-subtle-foreground',
  extracted: 'bg-ai-subtle text-ai-subtle-foreground',
  normalized: 'bg-ai-subtle text-ai-subtle-foreground',
  calculated: 'bg-ai-subtle text-ai-subtle-foreground',
  confidence_scored: 'bg-ai-subtle text-ai-subtle-foreground',
  review_started: 'bg-muted text-muted-foreground',
  approved: 'bg-success-subtle text-success-subtle-foreground',
  flagged: 'bg-warning-subtle text-warning-subtle-foreground',
  edited: 'bg-primary-subtle text-primary-subtle-foreground',
  rejected: 'bg-danger-subtle text-danger-subtle-foreground',
}

interface TraceabilityTimelineProps {
  events: TraceabilityTimelineEvent[]
}

export function TraceabilityTimeline({ events }: TraceabilityTimelineProps) {
  return (
    <motion.ol variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col">
      {events.map((event, index) => {
        const Icon = eventIcon[event.type]
        return (
          <motion.li key={event.id} variants={staggerItem} className="relative flex gap-3 pb-5 last:pb-0">
            {index < events.length - 1 && (
              <span
                className="bg-border absolute top-7 left-3.5 h-[calc(100%-1.75rem)] w-px"
                aria-hidden="true"
              />
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full',
                    eventTone[event.type]
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                {formatDate(event.timestamp, { dateStyle: 'medium', timeStyle: 'short' })}
              </TooltipContent>
            </Tooltip>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-foreground text-sm font-medium">{event.label}</p>
                <time dateTime={event.timestamp} className="text-foreground-tertiary shrink-0 text-xs">
                  {formatRelativeTime(event.timestamp)}
                </time>
              </div>
              <p className="text-foreground-secondary mt-0.5 text-xs leading-relaxed">{event.description}</p>
            </div>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}
