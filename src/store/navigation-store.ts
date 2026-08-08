import { create } from 'zustand'
import type { NavigationContext, TrailNode } from '@/types'

const RECENT_LIMIT = 8

function sameNode(a: TrailNode, b: TrailNode) {
  return a.type === b.type && a.id === b.id
}

interface NavigationState {
  /** The clickable breadcrumb path for the current workspace journey — grows
   * as the user follows related-object links, and is reset at true entry
   * points (sidebar nav, search, recent history). */
  trail: TrailNode[]
  /** Most-recently-visited objects across the whole session, independent of
   * the current trail — powers the "Recent" popover. */
  recent: TrailNode[]
  /** What the Context Bar shows — the return/client/document/task/status the
   * current workspace object belongs to. */
  context: NavigationContext

  /** Called by every workspace-capable page on mount/param change. Appends
   * to the trail (truncating back to an earlier visit of the same object
   * instead of duplicating it) and replaces the context bar's contents. */
  visit: (node: TrailNode, context?: NavigationContext) => void
  /** Called by true entry points — sidebar links, search results, recent
   * history — right before navigating, so the next `visit()` starts fresh. */
  resetTrail: () => void
  /** Breadcrumb click — jump back to an earlier point in the trail. */
  truncateTo: (index: number) => void
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  trail: [],
  recent: [],
  context: {},

  visit: (node, context) =>
    set((state) => {
      const existingIndex = state.trail.findIndex((n) => sameNode(n, node))
      const trail = existingIndex >= 0 ? [...state.trail.slice(0, existingIndex), node] : [...state.trail, node]
      const recent = [node, ...state.recent.filter((n) => !sameNode(n, node))].slice(0, RECENT_LIMIT)
      return { trail, recent, context: context ?? state.context }
    }),

  resetTrail: () => set({ trail: [], context: {} }),

  truncateTo: (index) => set((state) => ({ trail: state.trail.slice(0, index + 1) })),
}))
