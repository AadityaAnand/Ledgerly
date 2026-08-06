import type { DocumentStatus, ReturnStatus, TaskPriority, TaskStatus } from '@/types'

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
