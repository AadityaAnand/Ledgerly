import type { ID } from './common'

export type NotificationType = 'mention' | 'assignment' | 'status_change' | 'ai_flag' | 'message' | 'deadline'

export interface Notification {
  id: ID
  type: NotificationType
  title: string
  description?: string
  read: boolean
  createdAt: string
  actorId?: ID
}
