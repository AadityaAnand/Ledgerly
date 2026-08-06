import type { ReviewEntry } from '@/types'

export const reviewHistory: ReviewEntry[] = [
  {
    id: 'rev_1',
    returnId: 'ret_9',
    reviewerId: 'usr_3',
    decision: 'approved',
    note: 'Clean return, no changes needed.',
    createdAt: '2026-03-27T10:00:00.000Z',
  },
  {
    id: 'rev_2',
    returnId: 'ret_6',
    reviewerId: 'usr_6',
    decision: 'approved',
    createdAt: '2026-04-09T14:00:00.000Z',
  },
  {
    id: 'rev_3',
    returnId: 'ret_1',
    reviewerId: 'usr_3',
    decision: 'changes_requested',
    note: 'Please resolve the 1099 discrepancy before resubmitting for review.',
    createdAt: '2026-08-01T11:00:00.000Z',
  },
  {
    id: 'rev_4',
    returnId: 'ret_7',
    reviewerId: 'usr_3',
    decision: 'commented',
    note: 'Flagging the partner distribution issue — need clarification from client.',
    createdAt: '2026-08-04T15:10:00.000Z',
  },
]

export function getReviewHistoryByReturnId(returnId: string): ReviewEntry[] {
  return reviewHistory.filter((entry) => entry.returnId === returnId)
}
