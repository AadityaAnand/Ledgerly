import { useNavigate } from '@tanstack/react-router'
import { Building2, Check, ChevronsUpDown, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { workspaces } from '@/mock/workspaces'
import { useWorkspaceStore } from '@/store/workspace-store'
import { useNavigationStore } from '@/store/navigation-store'
import { useActiveWorkspace, useOwnWorkspaces } from '@/hooks/use-role'
import { roleLabels } from '@/lib/permissions'
import { getUserById } from '@/mock/users'
import { cn } from '@/lib/utils'
import type { Workspace } from '@/types'

/** Doubles as the persistent, compact role/context indicator (always
 * visible, whatever it's set to) and the switcher that lets a user move
 * between their own workspaces or preview how Ledgerly looks for another
 * role. */
export function WorkspaceSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const navigate = useNavigate()
  const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace)
  const resetTrail = useNavigationStore((s) => s.resetTrail)
  const active = useActiveWorkspace()
  const ownWorkspaces = useOwnWorkspaces()
  const activeUser = getUserById(active.userId)

  const otherWorkspaces = workspaces.filter((w) => w.userId !== active.userId)

  function handleSwitch(workspaceId: string) {
    if (workspaceId === active.id) return
    switchWorkspace(workspaceId)
    resetTrail()
    void navigate({ to: '/' })
  }

  const Icon = active.kind === 'personal' ? User : Building2

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Switch workspace — currently ${active.label}, ${active.roleLabel}`}
          className={cn(
            'hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          <div className="bg-primary-subtle text-primary-subtle-foreground flex size-7 shrink-0 items-center justify-center rounded-md">
            <Icon className="size-3.5" aria-hidden="true" />
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">
                  {active.organizationName ?? active.label}
                </p>
                <p className="text-foreground-tertiary truncate text-xs">{active.roleLabel}</p>
              </div>
              <ChevronsUpDown className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="font-normal">
          <p className="text-foreground text-sm font-medium">{activeUser?.name}</p>
          <p className="text-foreground-tertiary text-xs">
            {active.label} · {active.roleLabel}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-foreground-tertiary text-[11px] font-semibold tracking-wide uppercase">
          Your workspaces
        </DropdownMenuLabel>
        {ownWorkspaces.map((workspace) => (
          <WorkspaceMenuItem
            key={workspace.id}
            workspace={workspace}
            isActive={workspace.id === active.id}
            onSelect={() => handleSwitch(workspace.id)}
          />
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-foreground-tertiary text-[11px] font-semibold tracking-wide uppercase">
          Preview other roles
        </DropdownMenuLabel>
        <p className="text-foreground-tertiary px-2 pb-1.5 text-xs leading-relaxed">
          See how Ledgerly looks for a different person and role.
        </p>
        {otherWorkspaces.map((workspace) => (
          <WorkspaceMenuItem
            key={workspace.id}
            workspace={workspace}
            isActive={false}
            onSelect={() => handleSwitch(workspace.id)}
            showUserName
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function WorkspaceMenuItem({
  workspace,
  isActive,
  onSelect,
  showUserName = false,
}: {
  workspace: Workspace
  isActive: boolean
  onSelect: () => void
  showUserName?: boolean
}) {
  const user = getUserById(workspace.userId)
  const Icon = workspace.kind === 'personal' ? User : Building2

  return (
    <DropdownMenuItem onSelect={onSelect}>
      <div className="bg-surface flex size-6 shrink-0 items-center justify-center rounded-md">
        <Icon className="size-3" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate">
          {showUserName ? `${user?.name} — ${roleLabels[workspace.role]}` : workspace.label}
        </p>
        {!showUserName && <p className="text-foreground-tertiary truncate text-xs">{workspace.roleLabel}</p>}
      </div>
      {isActive && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
    </DropdownMenuItem>
  )
}
