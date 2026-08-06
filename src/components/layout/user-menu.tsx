import { LogOut, Settings, User } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/shared/user-avatar'
import { currentUser } from '@/mock'
import { cn } from '@/lib/utils'

interface UserMenuProps {
  collapsed?: boolean
}

export function UserMenu({ collapsed = false }: UserMenuProps) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'hover:bg-surface-hover flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          <UserAvatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="sm" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">{currentUser.name}</p>
              <p className="text-foreground-tertiary truncate text-xs">{currentUser.title}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="text-foreground text-sm font-medium">{currentUser.name}</p>
          <p className="text-foreground-tertiary text-xs">{currentUser.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void navigate({ to: '/settings' })}>
          <User className="size-4" aria-hidden="true" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void navigate({ to: '/settings' })}>
          <Settings className="size-4" aria-hidden="true" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => toast('This is a foundation build — sign out isn’t wired up yet.')}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
