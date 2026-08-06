import { Building2, Check, ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { organizations } from '@/mock'
import { useWorkspaceStore } from '@/store/workspace-store'
import { cn } from '@/lib/utils'

interface WorkspaceSwitcherProps {
  collapsed?: boolean
}

export function WorkspaceSwitcher({ collapsed = false }: WorkspaceSwitcherProps) {
  const currentOrganizationId = useWorkspaceStore((s) => s.currentOrganizationId)
  const setCurrentOrganizationId = useWorkspaceStore((s) => s.setCurrentOrganizationId)
  const current = organizations.find((org) => org.id === currentOrganizationId) ?? organizations[0]!

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
          <div className="bg-primary-subtle text-primary-subtle-foreground flex size-7 shrink-0 items-center justify-center rounded-md">
            <Building2 className="size-3.5" aria-hidden="true" />
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">{current.name}</p>
                <p className="text-foreground-tertiary truncate text-xs capitalize">{current.plan} plan</p>
              </div>
              <ChevronsUpDown className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} onSelect={() => setCurrentOrganizationId(org.id)}>
            <div className="bg-primary-subtle text-primary-subtle-foreground flex size-6 shrink-0 items-center justify-center rounded-md">
              <Building2 className="size-3" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate">{org.name}</p>
            </div>
            {org.id === current.id && <Check className="size-3.5" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Plus className="size-4" aria-hidden="true" />
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
