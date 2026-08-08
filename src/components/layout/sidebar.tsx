import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher'
import { UserMenu } from '@/components/layout/user-menu'
import { getNavItemsForRole } from '@/components/layout/nav-config'
import { useUIStore } from '@/store/ui-store'
import { useNavigationStore } from '@/store/navigation-store'
import { useActiveRole } from '@/hooks/use-role'
import { staggerContainer, staggerItem, transitions } from '@/lib/animations'
import { cn } from '@/lib/utils'

// Mirrors --sidebar-width / --sidebar-width-collapsed in tokens.css.
// Framer Motion needs numeric values to tween, so it can't read the CSS vars directly.
const EXPANDED_WIDTH = 272
const COLLAPSED_WIDTH = 72

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const resetTrail = useNavigationStore((s) => s.resetTrail)
  const role = useActiveRole()
  const navItems = getNavItemsForRole(role)

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={transitions.slow}
      className="bg-surface border-border relative flex h-full shrink-0 flex-col border-r"
    >
      <div className={cn('flex items-center justify-between px-4 pt-4', collapsed && 'justify-center px-0')}>
        <Link to="/" aria-label="Ledgerly home">
          <Logo size="sm" markOnly={collapsed} />
        </Link>
      </div>

      <div className={cn('mt-4 px-3', collapsed && 'px-2')}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <div className="bg-border mx-3 mt-4 h-px" />

      <AnimatePresence mode="wait">
        <motion.nav
          key={role}
          aria-label="Primary"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={cn('flex flex-col gap-0.5 px-3 py-4', collapsed && 'px-2')}
        >
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            const link = (
              <Link
                to={item.href}
                onClick={resetTrail}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                  collapsed && 'justify-center px-0 py-2.5',
                  isActive
                    ? 'bg-primary-subtle text-primary-subtle-foreground'
                    : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
                )}
              >
                <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )

            if (!collapsed) {
              return (
                <motion.div key={item.href} variants={staggerItem}>
                  {link}
                </motion.div>
              )
            }

            return (
              <motion.div key={item.href} variants={staggerItem}>
                <Tooltip>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </motion.div>
            )
          })}
        </motion.nav>
      </AnimatePresence>

      <div className="flex-1" />

      <div className={cn('px-3 pb-2', collapsed && 'px-2')}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                className="text-foreground-secondary hover:bg-surface-hover hover:text-foreground flex w-full items-center justify-center rounded-lg py-2.5 transition-colors"
              >
                <PanelLeftOpen className="size-4.5" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            className="text-foreground-secondary hover:bg-surface-hover hover:text-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors"
          >
            <PanelLeftClose className="size-4.5" aria-hidden="true" />
            Collapse sidebar
          </button>
        )}
      </div>

      <div className="bg-border mx-3 h-px" />

      <div className={cn('px-3 py-3', collapsed && 'px-2')}>
        <UserMenu collapsed={collapsed} />
      </div>
    </motion.aside>
  )
}
