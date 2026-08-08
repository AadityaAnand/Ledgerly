import type { Permission, Role } from '@/types'

/**
 * Single source of truth for what each role can do. Nothing in the app
 * should hardcode a role check — always go through `hasPermission` (or the
 * `useHasPermission` hook) so capability logic stays in one place.
 */
export const rolePermissions: Record<Role, Permission[]> = {
  CLIENT: ['VIEW_RETURN', 'VIEW_DOCUMENT', 'UPLOAD_DOCUMENT', 'SEND_CLIENT_MESSAGE'],

  BUSINESS_OWNER: ['VIEW_RETURN', 'VIEW_DOCUMENT', 'UPLOAD_DOCUMENT', 'SEND_CLIENT_MESSAGE'],

  PREPARER: [
    'VIEW_RETURN',
    'EDIT_RETURN',
    'VIEW_DOCUMENT',
    'UPLOAD_DOCUMENT',
    'SEND_CLIENT_MESSAGE',
    'VIEW_INTERNAL_NOTES',
    'REQUEST_DOCUMENT',
    'REVIEW_AI',
    'VIEW_CLIENTS',
  ],

  REVIEWER: [
    'VIEW_RETURN',
    'VIEW_DOCUMENT',
    'VIEW_INTERNAL_NOTES',
    'REVIEW_AI',
    'APPROVE_RETURN',
    'VIEW_CLIENTS',
    'SEND_CLIENT_MESSAGE',
  ],

  ADMIN: [
    'VIEW_RETURN',
    'EDIT_RETURN',
    'VIEW_DOCUMENT',
    'UPLOAD_DOCUMENT',
    'SEND_CLIENT_MESSAGE',
    'VIEW_INTERNAL_NOTES',
    'REQUEST_DOCUMENT',
    'REVIEW_AI',
    'APPROVE_RETURN',
    'VIEW_CLIENTS',
    'VIEW_FIRM_ANALYTICS',
    'MANAGE_STAFF',
    'MANAGE_SETTINGS',
  ],

  // Deliberately narrow — seasonal staff can view and work assigned items,
  // but can't edit returns, see internal notes, approve, or see firm-wide data.
  SEASONAL_STAFF: ['VIEW_RETURN', 'VIEW_DOCUMENT', 'UPLOAD_DOCUMENT', 'SEND_CLIENT_MESSAGE'],
}

export function getPermissionsForRole(role: Role): Permission[] {
  return rolePermissions[role]
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}

export const roleLabels: Record<Role, string> = {
  CLIENT: 'Individual Taxpayer',
  BUSINESS_OWNER: 'Business Owner',
  PREPARER: 'Tax Preparer',
  REVIEWER: 'Tax Reviewer',
  ADMIN: 'Firm Administrator',
  SEASONAL_STAFF: 'Seasonal Staff',
}
