import type { ID } from './common'

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: ID
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: ID
  clientId?: ID
  returnId?: ID
  dueDate?: string
  createdAt: string
}
