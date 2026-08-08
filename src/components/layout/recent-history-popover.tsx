import { useNavigate } from '@tanstack/react-router'
import { Clock } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IconButton } from '@/components/shared/icon-button'
import { EmptyState } from '@/components/shared/empty-state'
import { useNavigationStore } from '@/store/navigation-store'
import { workspaceTypeMeta } from '@/features/workspace/workspace-type-meta'

export function RecentHistoryPopover() {
  const navigate = useNavigate()
  const recent = useNavigationStore((s) => s.recent)
  const resetTrail = useNavigationStore((s) => s.resetTrail)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton label="Recently visited" showTooltip={false} icon={<Clock className="size-4" />} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-1.5">
        <p className="text-foreground-tertiary px-2 py-1.5 text-[11px] font-semibold tracking-wide uppercase">
          Recently visited
        </p>
        {recent.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Nothing yet"
            description="Objects you visit will show up here for quick access."
            className="py-6"
          />
        ) : (
          <ul className="flex flex-col">
            {recent.map((node) => {
              const Icon = workspaceTypeMeta[node.type].icon
              return (
                <li key={`${node.type}-${node.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      resetTrail()
                      void navigate({ to: node.href })
                    }}
                    className="hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors"
                  >
                    <Icon className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
                    <span className="text-foreground truncate text-sm">{node.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
