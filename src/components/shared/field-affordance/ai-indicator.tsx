import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIIndicatorProps {
  confidence?: number
  label?: string
  className?: string
}

/** The subtle "this came from AI" marker — sparkle + label, confidence
 * folded in inline rather than as a second badge. Deliberately restrained:
 * one muted purple tint, not a wash of it. */
export function AIIndicator({ confidence, label = 'AI Generated', className }: AIIndicatorProps) {
  return (
    <span
      className={cn(
        'bg-ai-subtle text-ai-subtle-foreground inline-flex h-5.5 items-center gap-1 rounded-full px-2 text-[0.6875rem] font-medium whitespace-nowrap',
        className
      )}
    >
      <Sparkles className="size-3" aria-hidden="true" />
      {label}
      {confidence !== undefined && <span className="tabular-nums opacity-80">· {confidence}%</span>}
    </span>
  )
}
