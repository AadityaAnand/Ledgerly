import type { ID } from './common'

export type ReviewDecision = 'approved' | 'changes_requested' | 'commented'

export interface ReviewEntry {
  id: ID
  returnId: ID
  reviewerId: ID
  decision: ReviewDecision
  note?: string
  createdAt: string
}
