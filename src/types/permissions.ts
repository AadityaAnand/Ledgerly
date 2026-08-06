import type { UserRole } from './user'

export type Permission =
  | 'returns.view'
  | 'returns.edit'
  | 'returns.approve'
  | 'documents.view'
  | 'documents.upload'
  | 'clients.manage'
  | 'billing.manage'
  | 'settings.manage'

export interface RoleDefinition {
  role: UserRole
  label: string
  description: string
  permissions: Permission[]
}
