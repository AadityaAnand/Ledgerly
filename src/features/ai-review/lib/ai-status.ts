import {
  AlertTriangle,
  Ban,
  Copy,
  EyeOff,
  FileWarning,
  Pencil,
  Scale,
  Sigma,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { AIFindingCategory, AIFindingSeverity, AIFindingStatus } from '@/types'

/** Single source of truth for AI finding status copy/icon — every consumer
 * pairs a state with an icon and a label, never color alone. */
export const aiFindingStatusMeta: Record<AIFindingStatus, { label: string; icon: LucideIcon; tone: string }> = {
  ai_suggested: { label: 'AI Suggested', icon: Sparkles, tone: 'bg-ai-subtle text-ai-subtle-foreground' },
  high_confidence: { label: 'High Confidence', icon: Sparkles, tone: 'bg-ai-subtle text-ai-subtle-foreground' },
  needs_review: { label: 'Needs Review', icon: AlertTriangle, tone: 'bg-warning-subtle text-warning-subtle-foreground' },
  human_verified: { label: 'Human Verified', icon: Sparkles, tone: 'bg-success-subtle text-success-subtle-foreground' },
  human_corrected: { label: 'Human Corrected', icon: Pencil, tone: 'bg-primary-subtle text-primary-subtle-foreground' },
  rejected: { label: 'Rejected', icon: Ban, tone: 'bg-danger-subtle text-danger-subtle-foreground' },
  dismissed: { label: 'Dismissed', icon: EyeOff, tone: 'bg-muted text-muted-foreground' },
}

export const aiFindingCategoryMeta: Record<AIFindingCategory, { label: string; icon: LucideIcon }> = {
  extraction: { label: 'Extraction', icon: Sparkles },
  discrepancy: { label: 'Discrepancy', icon: Scale },
  duplicate_document: { label: 'Possible duplicate', icon: Copy },
  missing_document: { label: 'Missing document', icon: FileWarning },
  unusual_deduction: { label: 'Unusual deduction', icon: AlertTriangle },
  conflicting_values: { label: 'Conflicting values', icon: Scale },
  suggested_correction: { label: 'Suggested correction', icon: Pencil },
  calculation_issue: { label: 'Calculation issue', icon: Sigma },
}

export const aiFindingSeverityMeta: Record<AIFindingSeverity, { label: string; tone: string }> = {
  info: { label: 'Info', tone: 'bg-muted text-muted-foreground' },
  warning: { label: 'Warning', tone: 'bg-warning-subtle text-warning-subtle-foreground' },
  critical: { label: 'Critical', tone: 'bg-danger-subtle text-danger-subtle-foreground' },
}

export const aiFindingActionLabel: Record<string, string> = {
  review_discrepancy: 'Review discrepancy',
  accept_suggestion: 'Accept suggested value',
  request_document: 'Request document',
  mark_expected: 'Mark as expected',
  dismiss: 'Dismiss finding',
  ask_cpa: 'Ask CPA',
  view_details: 'View details',
}

/** 85+ reads as "high confidence" with a checklist of what passed; below
 * that, the interface switches to "needs review" and explains why. */
export function isHighConfidence(confidence: number): boolean {
  return confidence >= 85
}
