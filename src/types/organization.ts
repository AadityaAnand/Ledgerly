import type { ID } from './common'

export type OrganizationPlan = 'starter' | 'professional' | 'enterprise'

export interface Organization {
  id: ID
  name: string
  slug: string
  plan: OrganizationPlan
  memberCount: number
  clientCount: number
}
