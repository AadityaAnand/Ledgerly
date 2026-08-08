import type { ReturnStatusDetail } from '@/types'

export const returnStatusDetails: ReturnStatusDetail[] = [
  // ─────────────────────── A — Information Needed ───────────────────────
  {
    returnId: 'ret_8',
    stage: 'information_needed',
    activity: [
      { id: 'rsa_8_1', actorName: 'Grace Kim', action: 'created her account', timestamp: '2026-07-22T14:00:00.000Z' },
      { id: 'rsa_8_2', actorName: 'Grace Kim', action: 'verified her identity', timestamp: '2026-07-22T14:12:00.000Z' },
      { id: 'rsa_8_3', actorName: 'Devon Ellis', action: 'was assigned as preparer', timestamp: '2026-07-22T15:00:00.000Z' },
    ],
    nextAction: {
      action: 'Tell us a bit about your tax situation so we can get started',
      ownerId: 'usr_13',
      dueDate: '2026-08-14',
      ctaLabel: 'Continue setup',
      ctaHref: '/',
    },
    updatedAt: '2026-07-23T09:30:00.000Z',
  },

  // ─────────────────────── D — Waiting on Client (documents) ───────────────────────
  {
    returnId: 'ret_2',
    stage: 'documents_collected',
    condition: 'waiting_on_client',
    blocker: {
      reason: 'Missing W-2 from Laura Tran',
      severity: 'warning',
      detail: "Michael's W-2 was verified on Jul 25. Laura's employer said hers would arrive by Friday.",
    },
    activity: [
      { id: 'rsa_2_1', actorName: 'Michael Tran', action: 'uploaded his W-2', timestamp: '2026-07-25T11:00:00.000Z' },
      { id: 'rsa_2_2', actorName: 'Devon Ellis', action: 'requested Laura’s W-2', timestamp: '2026-08-04T15:05:00.000Z' },
      { id: 'rsa_2_3', actorName: 'Michael Tran', action: 'confirmed it’s on the way', timestamp: '2026-08-04T15:20:00.000Z' },
    ],
    nextAction: {
      action: "Upload Laura's W-2",
      ownerId: 'usr_8',
      dueDate: '2026-08-07',
      ctaLabel: 'Upload document',
      ctaHref: '/documents',
    },
    updatedAt: '2026-08-04T15:20:00.000Z',
  },
  {
    returnId: 'ret_5',
    stage: 'documents_collected',
    condition: 'waiting_on_client',
    blocker: {
      reason: 'Q3 bank statements not yet received',
      severity: 'warning',
      detail: 'June through August statements are needed to reconcile business expenses.',
    },
    activity: [
      { id: 'rsa_5_1', actorName: 'Devon Ellis', action: 'requested June–August bank statements', timestamp: '2026-08-01T09:10:00.000Z' },
      { id: 'rsa_5_2', actorName: 'Renata Ford', action: 'uploaded the June statement', timestamp: '2026-08-01T09:00:00.000Z' },
    ],
    nextAction: {
      action: 'Send your July and August bank statements',
      ownerId: 'usr_10',
      dueDate: '2026-08-01',
      ctaLabel: 'Upload documents',
      ctaHref: '/documents',
    },
    updatedAt: '2026-08-05T10:00:00.000Z',
  },

  // ─────────────────────── B — Preparing Return (no blockers, recently completed a stage) ───────────────────────
  {
    returnId: 'ret_3',
    stage: 'preparing_return',
    justCompletedStage: 'documents_collected',
    activity: [
      { id: 'rsa_3_1', actorName: 'Marcus Webb', action: 'uploaded the depreciation schedule', timestamp: '2026-07-15T14:20:00.000Z' },
      { id: 'rsa_3_2', actorName: 'Marcus Webb', action: 'uploaded the K-1 for Kessler Holdings LP', timestamp: '2026-07-29T16:00:00.000Z' },
      { id: 'rsa_3_3', actorName: 'Marcus Webb', action: 'marked all documents collected', timestamp: '2026-08-05T09:00:00.000Z' },
      { id: 'rsa_3_4', actorName: 'Marcus Webb', action: 'began preparing the return', timestamp: '2026-08-05T09:05:00.000Z' },
    ],
    nextAction: {
      action: "Marcus is preparing your return from the documents you've provided",
      ownerId: 'usr_2',
      ctaLabel: 'View details',
    },
    updatedAt: '2026-08-05T09:05:00.000Z',
  },

  // ─────────────────────── G — Blocked (severity: danger) ───────────────────────
  {
    returnId: 'ret_1',
    stage: 'cpa_review',
    condition: 'blocked',
    blocker: {
      reason: '1099-NEC amount mismatch must be resolved',
      severity: 'danger',
      detail: 'Reported non-employee compensation ($18,400) doesn’t match the uploaded 1099-NEC ($19,650).',
    },
    activity: [
      { id: 'rsa_1_1', actorName: 'Marcus Webb', action: 'moved the return to In Review', timestamp: '2026-07-28T12:00:00.000Z' },
      { id: 'rsa_1_2', actorName: 'Ledgerly AI', action: 'flagged a 1099-NEC amount mismatch', timestamp: '2026-08-04T16:10:00.000Z' },
      { id: 'rsa_1_3', actorName: 'Priya Nathan', action: 'requested changes before continuing review', timestamp: '2026-08-01T11:00:00.000Z' },
    ],
    nextAction: {
      action: 'Resolve the 1099-NEC discrepancy before review can continue',
      ownerId: 'usr_2',
      dueDate: '2026-08-08',
      ctaLabel: 'Review discrepancy',
      ctaType: 'return',
      ctaId: 'ret_1',
    },
    updatedAt: '2026-08-04T16:10:00.000Z',
  },

  // ─────────────────────── C — CPA Review (nothing needed from the client) ───────────────────────
  {
    returnId: 'ret_7',
    stage: 'cpa_review',
    activity: [
      { id: 'rsa_7_1', actorName: 'Marcus Webb', action: 'uploaded the partner distributions worksheet', timestamp: '2026-07-22T13:00:00.000Z' },
      { id: 'rsa_7_2', actorName: 'Marcus Webb', action: 'finished preparing the return', timestamp: '2026-07-30T10:00:00.000Z' },
      { id: 'rsa_7_3', actorName: 'Priya Nathan', action: 'started review', timestamp: '2026-08-04T15:10:00.000Z' },
    ],
    nextAction: {
      action: 'Your CPA will send your return for approval once review is complete',
      ownerId: 'usr_3',
      ctaLabel: 'View details',
    },
    updatedAt: '2026-08-04T15:10:00.000Z',
  },

  // ─────────────────────── H + K — Client Review, requires clarification (needs_attention) ───────────────────────
  {
    returnId: 'ret_10',
    stage: 'client_review',
    condition: 'needs_attention',
    blocker: {
      reason: 'A quick clarification is needed before we finalize',
      severity: 'warning',
      detail: 'Marcus has a question about a $4,200 equipment purchase before it can be classified correctly.',
    },
    activity: [
      { id: 'rsa_10_1', actorName: 'Marcus Webb', action: 'prepared the return', timestamp: '2026-08-01T12:05:00.000Z' },
      { id: 'rsa_10_2', actorName: 'Marcus Webb', action: 'sent a question about an equipment expense', timestamp: '2026-08-03T15:41:00.000Z' },
    ],
    nextAction: {
      action: "Answer Marcus's question about your equipment expense",
      ownerId: 'usr_9',
      dueDate: '2026-08-10',
      ctaLabel: 'Reply in Messages',
      ctaHref: '/messages',
    },
    updatedAt: '2026-08-03T15:41:00.000Z',
  },

  // ─────────────────────── E + I — Ready to File, waiting on CPA ───────────────────────
  {
    returnId: 'ret_4',
    stage: 'ready_to_file',
    condition: 'waiting_on_cpa',
    activity: [
      { id: 'rsa_4_1', actorName: 'Naomi Whitfield', action: 'reviewed and approved her return', timestamp: '2026-08-04T09:00:00.000Z' },
      { id: 'rsa_4_2', actorName: 'James Okafor', action: 'signed off on the final numbers', timestamp: '2026-08-05T08:00:00.000Z' },
    ],
    nextAction: {
      action: 'Your CPA will file your return with the IRS',
      ownerId: 'usr_6',
      ctaLabel: 'View details',
    },
    updatedAt: '2026-08-05T08:00:00.000Z',
  },

  // ─────────────────────── F — Filed ───────────────────────
  {
    returnId: 'ret_9',
    stage: 'filed',
    activity: [
      { id: 'rsa_9_1', actorName: 'Marcus Webb', action: 'filed the return with the IRS', timestamp: '2026-03-28T09:00:00.000Z' },
      { id: 'rsa_9_2', actorName: 'IRS', action: 'accepted the return', timestamp: '2026-03-28T14:00:00.000Z' },
    ],
    nextAction: {
      action: 'Nothing needed — your return has been filed and accepted',
      ownerId: 'usr_2',
      ctaLabel: 'View return',
      ctaType: 'return',
      ctaId: 'ret_9',
    },
    updatedAt: '2026-03-28T14:00:00.000Z',
  },
]

export function getReturnStatusDetail(returnId: string): ReturnStatusDetail | undefined {
  return returnStatusDetails.find((d) => d.returnId === returnId)
}
