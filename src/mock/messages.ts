import type { Message, MessageThread } from '@/types'

export const messageThreads: MessageThread[] = [
  {
    id: 'thread_1',
    subject: 'Bennett Design Studio — 2025 return',
    clientId: 'cli_1',
    participantIds: ['usr_2', 'usr_7'],
    lastMessagePreview: 'Got it, I’ll upload the corrected 1099 today.',
    lastMessageAt: '2026-08-04T17:40:00.000Z',
    unreadCount: 2,
  },
  {
    id: 'thread_2',
    subject: 'Missing W-2 — Tran household',
    clientId: 'cli_2',
    participantIds: ['usr_4', 'usr_8'],
    lastMessagePreview: 'Laura’s employer said it should arrive by Friday.',
    lastMessageAt: '2026-08-04T15:05:00.000Z',
    unreadCount: 0,
  },
  {
    id: 'thread_3',
    subject: 'K-1 question — Kessler Holdings',
    clientId: 'cli_3',
    participantIds: ['usr_2', 'usr_3'],
    lastMessagePreview: 'Can you confirm the allocation percentage before I sign off?',
    lastMessageAt: '2026-08-03T13:22:00.000Z',
    unreadCount: 1,
  },
  {
    id: 'thread_4',
    subject: 'Ready for final review',
    clientId: 'cli_4',
    participantIds: ['usr_5', 'usr_6'],
    lastMessagePreview: 'Everything checks out on my end — over to you.',
    lastMessageAt: '2026-08-05T08:02:00.000Z',
    unreadCount: 0,
  },
]

export const messages: Message[] = [
  {
    id: 'msg_1',
    threadId: 'thread_1',
    senderId: 'usr_2',
    body: 'Hi Laura, our AI review flagged a mismatch on the Riverside Consulting 1099 — the amount reported doesn’t match what was filed. Could you double check?',
    sentAt: '2026-08-04T16:10:00.000Z',
  },
  {
    id: 'msg_2',
    threadId: 'thread_1',
    senderId: 'usr_7',
    body: 'Good catch — looks like I uploaded a draft version. Let me pull the corrected one.',
    sentAt: '2026-08-04T17:22:00.000Z',
  },
  {
    id: 'msg_3',
    threadId: 'thread_1',
    senderId: 'usr_7',
    body: 'Got it, I’ll upload the corrected 1099 today.',
    sentAt: '2026-08-04T17:40:00.000Z',
  },
  {
    id: 'msg_4',
    threadId: 'thread_3',
    senderId: 'usr_2',
    body: 'The K-1 from Kessler Holdings lists a 32% allocation but last year’s return had 28%. Want me to hold review until we get clarification?',
    sentAt: '2026-08-03T13:22:00.000Z',
  },
]

export function getThreadMessages(threadId: string): Message[] {
  return messages.filter((message) => message.threadId === threadId)
}
