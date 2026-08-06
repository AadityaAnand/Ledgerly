import { create } from 'zustand'
import { organizations } from '@/mock'

interface WorkspaceState {
  currentOrganizationId: string
  setCurrentOrganizationId: (id: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  currentOrganizationId: organizations[0]!.id,
  setCurrentOrganizationId: (id) => set({ currentOrganizationId: id }),
}))
