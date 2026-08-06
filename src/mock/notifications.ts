import type { Notification } from '@/types'

export const notifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'ai_flag',
    title: 'AI flagged a discrepancy on Bennett Design Studio',
    description: 'Reported 1099 income doesn’t match the uploaded document.',
    read: false,
    createdAt: '2026-08-04T16:10:00.000Z',
    actorId: 'usr_2',
  },
  {
    id: 'notif_2',
    type: 'message',
    title: 'Laura Bennett replied in Bennett Design Studio',
    description: 'Got it, I’ll upload the corrected 1099 today.',
    read: false,
    createdAt: '2026-08-04T17:40:00.000Z',
    actorId: 'usr_7',
  },
  {
    id: 'notif_3',
    type: 'assignment',
    title: 'You were assigned as reviewer on Harlow & Voss Legal',
    read: true,
    createdAt: '2026-08-04T09:00:00.000Z',
    actorId: 'usr_2',
  },
  {
    id: 'notif_4',
    type: 'status_change',
    title: 'Naomi Whitfield’s return moved to Ready to File',
    read: false,
    createdAt: '2026-08-05T08:00:00.000Z',
    actorId: 'usr_5',
  },
  {
    id: 'notif_5',
    type: 'deadline',
    title: '3 returns are due within 14 days',
    description: 'Extension deadline is September 15.',
    read: true,
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'notif_6',
    type: 'mention',
    title: 'Priya Nathan mentioned you on Kessler Manufacturing',
    read: true,
    createdAt: '2026-08-03T13:22:00.000Z',
    actorId: 'usr_3',
  },
  {
    id: 'notif_7',
    type: 'ai_flag',
    title: 'AI flagged a K-1 allocation change on Kessler Holdings',
    description: 'Allocation moved from 28% to 32% year over year.',
    read: true,
    createdAt: '2026-07-29T16:05:00.000Z',
    actorId: 'usr_2',
  },
]

export function getUnreadCount(): number {
  return notifications.filter((n) => !n.read).length
}
