import type { ID } from './common'

export type TraceCategory =
  | 'income'
  | 'business'
  | 'deductions'
  | 'credits'
  | 'payments_credits'
  | 'tax_summary'

export type VerificationStatus =
  'verified' | 'needs_review' | 'flagged' | 'overridden' | 'rejected' | 'unverified'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type DocumentLayout = 'boxed-form' | 'statement' | 'text-page'

export interface SourceDocument {
  id: ID
  clientId: ID
  name: string
  type: string
  issuer: string
  recipient: string
  layout: DocumentLayout
  pageCount: number
  uploadedAt: string
  /** For multi-page documents where only some pages carry the boxed-form/statement layout
   * (e.g. a K-1's supplementary pages are just dense instruction text). */
  pageLayouts?: Partial<Record<number, DocumentLayout>>
}

/** A single field rendered inside a document facsimile — a "box" on a form or a row in a
 * statement table. `id` is what a TaxFieldTrace's `sourceFieldId` points to. Highlight
 * position is measured live from the rendered DOM, never stored as static coordinates. */
export interface DocumentFieldSlot {
  id: ID
  documentId: ID
  pageNumber: number
  boxLabel?: string
  label: string
  value: string
}

export interface ValidationRuleResult {
  label: string
  passed: boolean
}

export type ReviewAction = 'approved' | 'rejected' | 'flagged' | 'edited' | 'reset' | 'commented'

export interface ReviewHistoryEntry {
  id: ID
  actorId: ID
  action: ReviewAction
  note?: string
  timestamp: string
  previousValue?: number
  newValue?: number
}

export type TimelineEventType =
  | 'uploaded'
  | 'processing'
  | 'extracted'
  | 'normalized'
  | 'calculated'
  | 'confidence_scored'
  | 'review_started'
  | 'approved'
  | 'flagged'
  | 'edited'
  | 'rejected'

export interface TraceabilityTimelineEvent {
  id: ID
  type: TimelineEventType
  label: string
  description: string
  timestamp: string
}

export interface TaxFieldTrace {
  id: ID
  returnId: ID
  category: TraceCategory
  label: string
  formLine: string
  value: number
  originalValue?: number
  verification: VerificationStatus
  /** 0-100. Derive `ConfidenceLevel` from this via `getConfidenceLevel()` rather than storing it. */
  confidence: number
  sourceDocumentId?: ID
  sourceFieldId?: ID
  sourceExcerpt?: string
  /** True when this value is derived purely by calculation with no single source document. */
  isCalculated: boolean
  aiExplanation: string
  transformationSteps: string[]
  calculationFormula?: string
  assumptions?: string[]
  risks?: string[]
  suggestedAction?: string
  validationRules: ValidationRuleResult[]
  reviewerId?: ID
  reviewedAt?: string
  reviewHistory: ReviewHistoryEntry[]
  timeline: TraceabilityTimelineEvent[]
  hasConflict?: boolean
  conflictNote?: string
}
