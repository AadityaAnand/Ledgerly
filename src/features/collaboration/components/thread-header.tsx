import { AlertOctagon, Clock } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getClientById } from '@/mock/clients'
import { getUserById } from '@/mock/users'
import { taskPriorityMeta } from '@/utils/status'
import { formatDate } from '@/utils/format'
import type { Conversation } from '@/types'

interface ThreadHeaderProps {
  conversation: Conversation
}

export function ThreadHeader({ conversation }: ThreadHeaderProps) {
  const client = getClientById(conversation.clientId)
  const owner = getUserById(conversation.ownerId)

  return (
    <header className="border-border flex shrink-0 items-center justify-between gap-4 border-b px-5 py-3.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-foreground truncate text-sm font-semibold">{conversation.title}</h1>
          <StatusBadge {...taskPriorityMeta[conversation.priority]} />
          {conversation.isBlocking && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-danger flex items-center">
                  <AlertOctagon className="size-3.5" aria-hidden="true" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Blocking — this must be resolved before the return can move forward</TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-foreground-tertiary truncate text-xs">{client?.name}</p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {conversation.dueDate && (
          <div className="text-foreground-tertiary flex items-center gap-1.5 text-xs">
            <Clock className="size-3.5" aria-hidden="true" />
            Due {formatDate(conversation.dueDate, { month: 'short', day: 'numeric' })}
          </div>
        )}
        {owner && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <UserAvatar name={owner.name} size="sm" />
                <span className="text-foreground-secondary text-xs font-medium">{owner.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Owns the next action</TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  )
}
