import { create } from 'zustand'

/** Lets a detail page (e.g. a return review workspace) append a dynamic
 * trailing crumb — "Home > Returns > Bennett Design Studio" — without every
 * route needing to know about every other route's naming. Set on mount,
 * cleared on unmount. */
interface BreadcrumbState {
  trailingLabel: string | null
  setTrailingLabel: (label: string | null) => void
}

export const useBreadcrumbStore = create<BreadcrumbState>()((set) => ({
  trailingLabel: null,
  setTrailingLabel: (label) => set({ trailingLabel: label }),
}))
