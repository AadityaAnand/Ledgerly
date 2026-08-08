import type { ID } from './common'

export type Role = 'CLIENT' | 'BUSINESS_OWNER' | 'PREPARER' | 'REVIEWER' | 'ADMIN' | 'SEASONAL_STAFF'

export type WorkspaceKind = 'firm' | 'personal'

export interface Workspace {
  id: ID
  kind: WorkspaceKind
  role: Role
  /** "Firm Workspace" / "Personal Workspace" — the workspace-level label. */
  label: string
  /** "Tax Preparer" / "Individual Taxpayer" — the human-readable role label. */
  roleLabel: string
  organizationName?: string
  /** The mock user this workspace is viewed as. */
  userId: ID
  clientId?: ID
  returnId?: ID
}
