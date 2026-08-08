import type { Workspace } from '@/types'

const FIRM_NAME = 'Harborview Tax & Advisory'

/**
 * Every switchable context in the product. Most users have exactly one
 * workspace (their single role). Sarah Chen has two — a firm workspace as a
 * preparer and a personal workspace as a taxpayer — which is the multi-role
 * "employee with their own return" scenario this challenge asks for.
 *
 * The other single-workspace users exist so every role can be demoed
 * without needing real authentication — see the "Preview other roles"
 * section of the workspace switcher.
 */
export const workspaces: Workspace[] = [
  {
    id: 'ws_sarah_firm',
    kind: 'firm',
    role: 'PREPARER',
    label: 'Firm Workspace',
    roleLabel: 'Tax Preparer',
    organizationName: FIRM_NAME,
    userId: 'usr_1',
  },
  {
    id: 'ws_sarah_personal',
    kind: 'personal',
    role: 'CLIENT',
    label: 'Personal Workspace',
    roleLabel: 'Individual Taxpayer',
    userId: 'usr_1',
    clientId: 'cli_9',
    returnId: 'ret_11',
  },
  {
    id: 'ws_michael_client',
    kind: 'firm',
    role: 'CLIENT',
    label: 'Client Workspace',
    roleLabel: 'Individual Taxpayer',
    organizationName: FIRM_NAME,
    userId: 'usr_8',
    clientId: 'cli_2',
    returnId: 'ret_2',
  },
  {
    id: 'ws_kessler_business',
    kind: 'firm',
    role: 'BUSINESS_OWNER',
    label: 'Client Workspace',
    roleLabel: 'Business Owner',
    organizationName: FIRM_NAME,
    userId: 'usr_9',
    clientId: 'cli_3',
    returnId: 'ret_3',
  },
  {
    id: 'ws_priya_reviewer',
    kind: 'firm',
    role: 'REVIEWER',
    label: 'Firm Workspace',
    roleLabel: 'Tax Reviewer',
    organizationName: FIRM_NAME,
    userId: 'usr_3',
  },
  {
    id: 'ws_james_admin',
    kind: 'firm',
    role: 'ADMIN',
    label: 'Firm Workspace',
    roleLabel: 'Firm Administrator',
    organizationName: FIRM_NAME,
    userId: 'usr_6',
  },
  {
    id: 'ws_jordan_seasonal',
    kind: 'firm',
    role: 'SEASONAL_STAFF',
    label: 'Firm Workspace',
    roleLabel: 'Seasonal Staff',
    organizationName: FIRM_NAME,
    userId: 'usr_14',
  },
]

export function getWorkspaceById(id: string): Workspace | undefined {
  return workspaces.find((w) => w.id === id)
}

export function getWorkspacesByUserId(userId: string): Workspace[] {
  return workspaces.filter((w) => w.userId === userId)
}

/** The default workspace a fresh session lands in — Sarah, in her firm
 * workspace, as a preparer. */
export const defaultWorkspaceId = 'ws_sarah_firm'
