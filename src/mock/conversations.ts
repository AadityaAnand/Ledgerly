import type { Conversation } from '@/types'

export const conversations: Conversation[] = [
  // ─────────────────────── Needs My Attention ───────────────────────
  {
    id: 'conv_1099_bennett',
    title: '1099-NEC discrepancy',
    clientId: 'cli_1',
    category: 'needs_attention',
    priority: 'high',
    returnId: 'ret_1',
    relatedDocumentIds: ['doc_1', 'doc_2'],
    linkedTaskIds: ['task_1'],
    ownerId: 'usr_2',
    nextAction: 'Confirm corrected 1099 resolves the discrepancy and update the return',
    dueDate: '2026-08-08',
    isBlocking: true,
    participantIds: ['usr_2', 'usr_3', 'usr_7'],
    unreadCount: 2,
    lastActivityAt: '2026-08-04T17:40:00.000Z',
  },
  {
    id: 'conv_engagement_letter',
    title: 'Engagement letter renewal',
    clientId: 'cli_7',
    category: 'needs_attention',
    priority: 'low',
    linkedTaskIds: ['task_11'],
    ownerId: 'usr_1',
    nextAction: 'Sign off on renewal terms',
    dueDate: '2026-08-11',
    isBlocking: false,
    participantIds: ['usr_1', 'usr_2'],
    unreadCount: 1,
    lastActivityAt: '2026-08-04T09:10:00.000Z',
  },

  // ─────────────────────── Waiting on Client ───────────────────────
  {
    id: 'conv_missing_w2_tran',
    title: 'Missing W-2',
    clientId: 'cli_2',
    category: 'waiting_on_client',
    priority: 'medium',
    returnId: 'ret_2',
    relatedDocumentIds: ['doc_4'],
    linkedTaskIds: ['task_2'],
    ownerId: 'usr_8',
    nextAction: 'Upload Laura Tran’s W-2',
    dueDate: '2026-08-07',
    isBlocking: true,
    participantIds: ['usr_4', 'usr_8'],
    unreadCount: 0,
    lastActivityAt: '2026-08-04T15:05:00.000Z',
  },
  {
    id: 'conv_bank_statements_bakery',
    title: 'Q3 bank statements needed',
    clientId: 'cli_5',
    category: 'waiting_on_client',
    priority: 'high',
    returnId: 'ret_5',
    linkedTaskIds: ['task_5'],
    ownerId: 'usr_10',
    nextAction: 'Send June–August bank statements',
    dueDate: '2026-08-01',
    isBlocking: true,
    participantIds: ['usr_4', 'usr_10'],
    unreadCount: 0,
    lastActivityAt: '2026-08-05T10:00:00.000Z',
  },

  // ─────────────────────── Internal Review ───────────────────────
  {
    id: 'conv_k1_riverside',
    title: 'K-1 allocation change — Riverside Ventures LLC',
    clientId: 'cli_1',
    category: 'internal_review',
    priority: 'urgent',
    returnId: 'ret_1',
    relatedFieldIds: ['k1_passthrough_income'],
    ownerId: 'usr_2',
    nextAction: 'Confirm allocation change with the partnership’s accountant',
    dueDate: '2026-08-09',
    isBlocking: true,
    participantIds: ['usr_2', 'usr_3'],
    unreadCount: 1,
    lastActivityAt: '2026-08-01T11:05:00.000Z',
    reviewStatus: 'in_review',
  },
  {
    id: 'conv_signoff_whitfield',
    title: 'Return sign-off',
    clientId: 'cli_4',
    category: 'internal_review',
    priority: 'medium',
    returnId: 'ret_4',
    linkedTaskIds: ['task_4'],
    ownerId: 'usr_5',
    nextAction: 'Notify client the return is ready to file',
    dueDate: '2026-08-06',
    isBlocking: false,
    participantIds: ['usr_5', 'usr_6'],
    unreadCount: 0,
    lastActivityAt: '2026-08-05T08:05:00.000Z',
    reviewStatus: 'approved',
  },

  // ─────────────────────── Completed ───────────────────────
  {
    id: 'conv_donation_receipts',
    title: 'Charitable donation receipts',
    clientId: 'cli_1',
    category: 'completed',
    priority: 'low',
    relatedDocumentIds: ['doc_1'],
    ownerId: 'usr_2',
    nextAction: 'None — resolved',
    participantIds: ['usr_2', 'usr_7'],
    unreadCount: 0,
    lastActivityAt: '2026-07-20T14:30:00.000Z',
    reviewStatus: 'approved',
  },
  {
    id: 'conv_2024_questions_alvarez',
    title: '2024 return questions',
    clientId: 'cli_6',
    category: 'completed',
    priority: 'low',
    returnId: 'ret_6',
    ownerId: 'usr_5',
    nextAction: 'None — resolved',
    participantIds: ['usr_5', 'usr_12'],
    unreadCount: 0,
    lastActivityAt: '2026-04-12T09:15:00.000Z',
    reviewStatus: 'approved',
  },
]

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id)
}

export function getConversationsByReturnId(returnId: string): Conversation[] {
  return conversations.filter((c) => c.returnId === returnId)
}

export function getConversationsByClientId(clientId: string): Conversation[] {
  return conversations.filter((c) => c.clientId === clientId)
}
