import type { ID } from './common'

export type ClientType = 'individual' | 'business'
export type ClientLifecycleStatus = 'active' | 'prospective' | 'archived'

export interface Client {
  id: ID
  name: string
  type: ClientType
  email: string
  entityType: string
  status: ClientLifecycleStatus
  taxYear: number
  primaryPreparerId: ID
  returnIds: ID[]
  initials: string
  createdAt: string
}
