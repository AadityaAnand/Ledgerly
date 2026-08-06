import {
  BarChart3,
  CheckSquare,
  FilePlus,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  UploadCloud,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

/** Single source of truth for primary navigation — consumed by the
 * sidebar, the command palette, and breadcrumbs. */
export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Returns', href: '/returns', icon: FileText },
  { label: 'Documents', href: '/documents', icon: FolderOpen },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'AI Review', href: '/ai-review', icon: Sparkles },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function getNavItemByHref(href: string): NavItem | undefined {
  return navItems.find((item) => item.href === href)
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
