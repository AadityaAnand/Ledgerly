import {
  BarChart3,
  CheckSquare,
  ClipboardCheck,
  FilePlus,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  Settings,
  Sparkles,
  UploadCloud,
  UserCog,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '@/types'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

/** Every nav item that exists anywhere in the product, keyed by role. This
 * is the actual "navigation changes by role" requirement — each role gets
 * its own intentional list, not a filtered/disabled version of one master
 * list. Consumed by the Sidebar, the command palette, and breadcrumbs. */
export const roleNavItems: Record<Role, NavItem[]> = {
  CLIENT: [
    { label: 'My Return', href: '/', icon: LayoutDashboard },
    { label: 'Get Started', href: '/get-started', icon: Rocket },
    { label: 'Documents', href: '/documents', icon: FolderOpen },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
  ],
  BUSINESS_OWNER: [
    { label: 'Business Return', href: '/', icon: LayoutDashboard },
    { label: 'Get Started', href: '/get-started', icon: Rocket },
    { label: 'Documents', href: '/documents', icon: FolderOpen },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
  ],
  PREPARER: [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Get Started', href: '/get-started', icon: Rocket },
    { label: 'Returns', href: '/returns', icon: FileText },
    { label: 'Clients', href: '/clients', icon: Users },
    { label: 'Documents', href: '/documents', icon: FolderOpen },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'AI Review', href: '/ai-review', icon: Sparkles },
  ],
  REVIEWER: [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Get Started', href: '/get-started', icon: Rocket },
    { label: 'Review Queue', href: '/review-queue', icon: ClipboardCheck },
    { label: 'Returns', href: '/returns', icon: FileText },
    { label: 'AI Review', href: '/ai-review', icon: Sparkles },
    { label: 'Clients', href: '/clients', icon: Users },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Get Started', href: '/get-started', icon: Rocket },
    { label: 'Clients', href: '/clients', icon: Users },
    { label: 'Returns', href: '/returns', icon: FileText },
    { label: 'Staff', href: '/staff', icon: UserCog },
    { label: 'Analytics', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ],
  SEASONAL_STAFF: [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Get Started', href: '/get-started', icon: Rocket },
    { label: 'Assigned Returns', href: '/returns', icon: FileText },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Documents', href: '/documents', icon: FolderOpen },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
  ],
}

export function getNavItemsForRole(role: Role): NavItem[] {
  return roleNavItems[role]
}

/** Looks up the current section's nav item for breadcrumbs — checks the
 * active role's own list first (so labels like "My Return" vs "Dashboard"
 * for the same "/" href are correct), then falls back to any role's list. */
export function getNavItemByHref(pathname: string, role: Role): NavItem | undefined {
  const ownItem = roleNavItems[role].find((item) => item.href === pathname)
  if (ownItem) return ownItem
  for (const items of Object.values(roleNavItems)) {
    const match = items.find((item) => item.href === pathname)
    if (match) return match
  }
  return undefined
}

export interface QuickAction {
  label: string
  icon: LucideIcon
}

/** Shared by the command palette and the top nav's "New" menu. */
export const quickActions: QuickAction[] = [
  { label: 'Create new return', icon: FilePlus },
  { label: 'Add a client', icon: UserPlus },
  { label: 'Upload a document', icon: UploadCloud },
]
