import type { ID } from './common'
import type { TaskPriority } from './task'

export type WorkItemCategory =
  | 'ai_review'
  | 'missing_document'
  | 'blocked'
  | 'cpa_review'
  | 'client_review'
  | 'ready_to_file'
  | 'task'

/** A single normalized, actionable unit of work — derived from returns,
 * tasks, AI suggestions, and outstanding document requests, never
 * hand-authored as its own mock data. See `lib/work-priority.ts`. */
export interface WorkItem {
  id: ID
  category: WorkItemCategory
  clientId?: ID
  clientName?: string
  returnId?: ID
  returnLabel?: string
  taskId?: ID
  title: string
  reason: string
  priority: TaskPriority
  dueDate?: string
  ownerId: ID
  conditionLabel?: string
  ctaLabel: string
  ctaHref: string
  createdAt: string
  score: number
}

export interface WorkItemFilters {
  search: string
  category: WorkItemCategory | null
  priority: TaskPriority | null
  ownerId: ID | null
  dueWithin: 'overdue' | 'today' | 'week' | null
}
