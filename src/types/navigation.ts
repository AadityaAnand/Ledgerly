import type { ID } from './common'

export type WorkspaceObjectType = 'return' | 'document' | 'task' | 'conversation' | 'question' | 'ai_review' | 'client'

export interface TrailNode {
  type: WorkspaceObjectType
  id: ID
  label: string
  href: string
}

export interface NavigationContext {
  returnId?: ID
  clientId?: ID
  documentId?: ID
  taskId?: ID
  status?: string
}
