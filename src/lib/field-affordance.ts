import { Check, Lock, Pencil, ShieldAlert, Sparkles, SquareArrowOutUpRight, type LucideIcon } from 'lucide-react'
import type { FieldState } from '@/types'
import type { Tone } from '@/utils/status'

export interface FieldStateMeta {
  label: string
  icon: LucideIcon
  tone: Tone
}

/** The single source of truth for how each field state looks — label,
 * icon, and color tone. Every field-affordance component reads from here
 * rather than hardcoding copy or colors. */
export const fieldStateMeta: Record<FieldState, FieldStateMeta> = {
  read_only: { label: 'Read only', icon: Lock, tone: 'neutral' },
  clickable: { label: 'Open', icon: SquareArrowOutUpRight, tone: 'neutral' },
  editable: { label: 'Editable', icon: Pencil, tone: 'primary' },
  ai_generated: { label: 'AI Generated', icon: Sparkles, tone: 'ai' },
  verified: { label: 'Verified', icon: Check, tone: 'success' },
  needs_approval: { label: 'Needs Approval', icon: ShieldAlert, tone: 'warning' },
  locked: { label: 'Locked', icon: Lock, tone: 'neutral' },
}
