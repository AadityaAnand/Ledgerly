import type { ID } from './common'

export interface MessageThread {
  id: ID
  subject: string
  clientId?: ID
  participantIds: ID[]
  lastMessagePreview: string
  lastMessageAt: string
  unreadCount: number
}

export interface Message {
  id: ID
  threadId: ID
  senderId: ID
  body: string
  sentAt: string
}
