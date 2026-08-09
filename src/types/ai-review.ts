import type { ID } from './common'
import type { ReviewHistoryEntry, TraceabilityTimelineEvent } from './traceability'

/** What kind of thing the AI is flagging (mismatch, duplicate, missing
 * document, etc). */
export type AIFindingCategory =
  | 'extraction'
  | 'discrepancy'
  | 'duplicate_document'
  | 'missing_document'
  | 'unusual_deduction'
  | 'conflicting_values'
  | 'suggested_correction'
  | 'calculation_issue'

export type AIFindingSeverity = 'info' | 'warning' | 'critical'

/** The full lifecycle a finding moves through — AI-authored states first,
 * then the human decisions that can be made about it. Never rely on color
 * alone to distinguish these; every consumer pairs a state with an icon
 * and a label (see `lib/ai-status.ts`). */
export type AIFindingStatus =
  | 'ai_suggested'
  | 'high_confidence'
  | 'needs_review'
  | 'human_verified'
  | 'human_corrected'
  | 'rejected'
  | 'dismissed'

/** A single piece of supporting evidence — always traceable back to a real
 * source (a document, a field on the return, or another record) rather
 * than an assertion the user has to take on faith. */
export interface AIEvidenceItem {
  label: string
  value: string
  sourceDocumentId?: ID
  pageNumber?: number
  boxLabel?: string
  isDiscrepant?: boolean
}

export type AIFindingActionKind =
  | 'review_discrepancy'
  | 'accept_suggestion'
  | 'request_document'
  | 'mark_expected'
  | 'dismiss'
  | 'ask_cpa'
  | 'view_details'

export interface AIFindingRecommendation {
  label: string
  action: AIFindingActionKind
}

/**
 * The normalized AI response shape used across the app. Every finding —
 * whether hand-authored or derived from `TaxFieldTrace` / `AISuggestion`
 * records — is normalized into this one structure so the review workspace
 * has a single, consistent contract to render against.
 */
export interface AIFinding {
  id: ID
  title: string
  category: AIFindingCategory
  severity: AIFindingSeverity
  status: AIFindingStatus
  confidence: number
  /** User-facing reasons the confidence score is as high as it is — never
   * exposes internal model chain-of-thought, just observable checks. */
  confidenceReasons: string[]
  /** Populated only when confidence is below the "high" threshold — the
   * plain-language reasons it's lower. */
  uncertaintyReasons?: string[]
  /** One or two sentences: what the AI compared and what it found. */
  explanation: string
  evidence: AIEvidenceItem[]
  recommendation: AIFindingRecommendation
  returnId: ID
  clientId: ID
  relatedFieldId?: ID
  relatedDocumentId?: ID
  relatedTaskId?: ID
  currentValue?: number
  suggestedValue?: number
  /** Set once a human has entered a corrected value — distinct from
   * `suggestedValue`, which is always the AI's original number. */
  correctedValue?: number
  correctionReason?: string
  reviewerId?: ID
  reviewedAt?: string
  reviewHistory: ReviewHistoryEntry[]
  timeline: TraceabilityTimelineEvent[]
  createdAt: string
}
