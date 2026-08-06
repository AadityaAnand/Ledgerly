import type { ID } from './common'

export type UserRole = 'admin' | 'preparer' | 'reviewer' | 'client'

export interface User {
  id: ID
  name: string
  email: string
  avatarUrl?: string
  role: UserRole
  title?: string
  organizationId: ID
  initials: string
}
