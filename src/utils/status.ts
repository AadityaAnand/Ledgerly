import type {
  AISuggestionSeverity,
  ApprovalStatus,
  ConfidenceLevel,
  ConversationCategory,
  DocumentRequestStatus,
  DocumentStatus,
  ReturnStatus,
  TaskPriority,
  TaskStatus,
  TraceCategory,
  VerificationStatus,
} from '@/types'

export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'ai'

export interface StatusMeta {
  label: string
  tone: Tone
}

export const returnStatusMeta: Record<ReturnStatus, StatusMeta> = {
  not_started: { label: 'Not started', tone: 'neutral' },
  gathering_documents: { label: 'Gathering documents', tone: 'neutral' },
  in_preparation: { label: 'In preparation', tone: 'primary' },
  in_review: { label: 'In review', tone: 'ai' },
  needs_client_info: { label: 'Needs client info', tone: 'warning' },
  ready_to_file: { label: 'Ready to file', tone: 'success' },
  filed: { label: 'Filed', tone: 'primary' },
  accepted: { label: 'Accepted', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
}

export const taskStatusMeta: Record<TaskStatus, StatusMeta> = {
  todo: { label: 'To do', tone: 'neutral' },
  in_progress: { label: 'In progress', tone: 'primary' },
  blocked: { label: 'Blocked', tone: 'danger' },
  done: { label: 'Done', tone: 'success' },
}

export const taskPriorityMeta: Record<TaskPriority, StatusMeta> = {
  low: { label: 'Low', tone: 'neutral' },
  medium: { label: 'Medium', tone: 'primary' },
  high: { label: 'High', tone: 'warning' },
  urgent: { label: 'Urgent', tone: 'danger' },
}

export const documentStatusMeta: Record<DocumentStatus, StatusMeta> = {
  uploaded: { label: 'Uploaded', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'ai' },
  verified: { label: 'Verified', tone: 'success' },
  flagged: { label: 'Flagged', tone: 'warning' },
}

export const verificationStatusMeta: Record<VerificationStatus, StatusMeta> = {
  verified: { label: 'Verified', tone: 'success' },
  needs_review: { label: 'Needs review', tone: 'warning' },
  flagged: { label: 'Flagged', tone: 'danger' },
  overridden: { label: 'Manually overridden', tone: 'primary' },
  rejected: { label: 'Rejected', tone: 'danger' },
  unverified: { label: 'Unverified', tone: 'neutral' },
}

export const traceCategoryLabels: Record<TraceCategory, string> = {
  income: 'Income',
  deductions: 'Deductions',
  payments_credits: 'Payments & Credits',
  tax_summary: 'Tax Summary',
}

/** Derived, not stored — keeps the confidence badge always in sync with the score. */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 85) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

export const confidenceLevelMeta: Record<ConfidenceLevel, StatusMeta> = {
  high: { label: 'High confidence', tone: 'success' },
  medium: { label: 'Medium confidence', tone: 'warning' },
  low: { label: 'Low confidence', tone: 'danger' },
}

export const conversationCategoryMeta: Record<ConversationCategory, StatusMeta> = {
  needs_attention: { label: 'Needs My Attention', tone: 'warning' },
  waiting_on_client: { label: 'Waiting on Client', tone: 'ai' },
  internal_review: { label: 'Internal Review', tone: 'primary' },
  completed: { label: 'Completed', tone: 'success' },
}

export const documentRequestStatusMeta: Record<DocumentRequestStatus, StatusMeta> = {
  waiting_on_client: { label: 'Waiting on Client', tone: 'ai' },
  received: { label: 'Received', tone: 'success' },
  overdue: { label: 'Overdue', tone: 'danger' },
}

export const approvalStatusMeta: Record<ApprovalStatus, StatusMeta> = {
  pending: { label: 'Pending approval', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
}

export const aiSeverityMeta: Record<AISuggestionSeverity, StatusMeta> = {
  info: { label: 'Info', tone: 'ai' },
  warning: { label: 'Warning', tone: 'warning' },
  critical: { label: 'Critical', tone: 'danger' },
}

/** ConversationPriority shares the exact same union as TaskPriority — reuse
 * `taskPriorityMeta` for conversation priority badges rather than duplicating it. */
