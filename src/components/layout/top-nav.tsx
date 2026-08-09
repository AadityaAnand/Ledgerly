import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { NotificationBell } from '@/components/layout/notification-bell'
import { RecentHistoryPopover } from '@/components/layout/recent-history-popover'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { UserMenu } from '@/components/layout/user-menu'
import { quickActions } from '@/components/layout/nav-config'
import { useUIStore } from '@/store/ui-store'

export function TopNav() {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)

  return (
    <header className="border-border bg-background/95 sticky top-0 z-30 flex h-15 shrink-0 items-center justify-between gap-4 border-b px-6 backdrop-blur-sm">
      <Breadcrumbs />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="border-border bg-surface text-foreground-tertiary hover:bg-surface-hover flex h-9 w-64 items-center gap-2 rounded-lg border px-3 text-sm transition-colors"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="bg-background border-border text-foreground-tertiary rounded border px-1.5 py-0.5 font-sans text-[0.6875rem]">
            ⌘K
          </kbd>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" aria-hidden="true" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {quickActions.map((action) => (
              <DropdownMenuItem
                key={action.label}
                onSelect={() =>
                  toast(action.label, {
                    description: 'This action isn’t available yet.',
                  })
                }
              >
                <action.icon className="size-4" aria-hidden="true" />
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="bg-border mx-1 h-5 w-px" />

        <RecentHistoryPopover />
        <NotificationBell />
        <ThemeToggle />

        <div className="bg-border mx-1 h-5 w-px" />

        <UserMenu collapsed />
      </div>
    </header>
  )
}
