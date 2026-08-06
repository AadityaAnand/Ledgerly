import type { ID } from './common'

export interface TimelineEvent {
  id: ID
  returnId?: ID
  clientId?: ID
  actorId: ID
  action: string
  createdAt: string
}

export interface ActivityFeedItem {
  id: ID
  actorId: ID
  verb: string
  targetLabel: string
  createdAt: string
}
