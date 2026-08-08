import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultWorkspaceId } from '@/mock/workspaces'

interface WorkspaceState {
  activeWorkspaceId: string
  switchWorkspace: (workspaceId: string) => void
}

/** Which workspace (role + context) is currently active. No real auth here
 * — this is the mocked "who am I, and in what capacity" for the whole app.
 * Persisted (like `ui-store`'s sidebar state) so a mid-demo page reload
 * doesn't silently drop back to the default persona.
 * See `useActiveWorkspace` / `useHasPermission` for how the rest of the
 * product reads this. */
export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: defaultWorkspaceId,
      switchWorkspace: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
    }),
    { name: 'ledgerly-workspace' }
  )
)
