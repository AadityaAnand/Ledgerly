import { useWorkspaceStore } from '@/store/workspace-store'
import { getWorkspaceById, getWorkspacesByUserId, workspaces } from '@/mock/workspaces'
import { getUserById } from '@/mock/users'
import { hasPermission } from '@/lib/permissions'
import type { Permission, Role, Workspace } from '@/types'

/** The full workspace record for whatever's currently active — role,
 * organization/personal context, and the mock user it's viewed as. */
export function useActiveWorkspace(): Workspace {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)
  return getWorkspaceById(activeWorkspaceId) ?? workspaces[0]!
}

export function useActiveRole(): Role {
  return useActiveWorkspace().role
}

/** The mock user the active workspace is viewed as — drives the avatar/name
 * shown in the sidebar while a given persona is active. */
export function useActiveRoleUser() {
  const workspace = useActiveWorkspace()
  return getUserById(workspace.userId)!
}

/** Every workspace the same person (the active workspace's user) can switch
 * between — this is what powers "multiple roles for one user". */
export function useOwnWorkspaces(): Workspace[] {
  const workspace = useActiveWorkspace()
  return getWorkspacesByUserId(workspace.userId)
}

export function useHasPermission(permission: Permission): boolean {
  const role = useActiveRole()
  return hasPermission(role, permission)
}
