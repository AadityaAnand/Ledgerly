import type { ActivityFeedItem, TimelineEvent } from '@/types'

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'evt_1',
    returnId: 'ret_1',
    clientId: 'cli_1',
    actorId: 'usr_7',
    action: 'uploaded 1099-NEC — Riverside Consulting.pdf',
    createdAt: '2026-07-19T09:30:00.000Z',
  },
  {
    id: 'evt_2',
    returnId: 'ret_1',
    clientId: 'cli_1',
    actorId: 'usr_2',
    action: 'moved return to In Review',
    createdAt: '2026-07-28T12:00:00.000Z',
  },
  {
    id: 'evt_3',
    returnId: 'ret_1',
    clientId: 'cli_1',
    actorId: 'usr_2',
    action: 'flagged 1099 discrepancy for client follow-up',
    createdAt: '2026-08-04T16:10:00.000Z',
  },
  {
    id: 'evt_4',
    returnId: 'ret_4',
    clientId: 'cli_4',
    actorId: 'usr_5',
    action: 'marked return Ready to File',
    createdAt: '2026-08-05T08:00:00.000Z',
  },
  {
    id: 'evt_5',
    returnId: 'ret_6',
    clientId: 'cli_6',
    actorId: 'usr_6',
    action: 'e-filed return with the IRS',
    createdAt: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'evt_6',
    returnId: 'ret_7',
    clientId: 'cli_7',
    actorId: 'usr_2',
    action: 'uploaded partner distributions worksheet',
    createdAt: '2026-07-22T13:00:00.000Z',
  },
]

export const activityFeed: ActivityFeedItem[] = [
  {
    id: 'act_1',
    actorId: 'usr_5',
    verb: 'marked Ready to File',
    targetLabel: 'Naomi Whitfield — 1040',
    createdAt: '2026-08-05T08:00:00.000Z',
  },
  {
    id: 'act_2',
    actorId: 'usr_7',
    verb: 'replied in',
    targetLabel: 'Bennett Design Studio',
    createdAt: '2026-08-04T17:40:00.000Z',
  },
  {
    id: 'act_3',
    actorId: 'usr_2',
    verb: 'uploaded a document to',
    targetLabel: 'Bennett Design Studio',
    createdAt: '2026-07-19T09:30:00.000Z',
  },
  {
    id: 'act_4',
    actorId: 'usr_3',
    verb: 'commented on',
    targetLabel: 'Kessler Manufacturing Co.',
    createdAt: '2026-08-03T13:22:00.000Z',
  },
  {
    id: 'act_5',
    actorId: 'usr_4',
    verb: 'requested a document from',
    targetLabel: 'Michael & Laura Tran',
    createdAt: '2026-08-04T15:05:00.000Z',
  },
]
