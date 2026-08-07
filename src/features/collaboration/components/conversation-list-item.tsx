import { AlertOctagon, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { UserAvatar } from '@/components/shared/user-avatar'
import { staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { getClientById } from '@/mock/clients'
import { getDocumentById } from '@/mock/documents'
import { getUserById } from '@/mock/users'
import { taskPriorityMeta } from '@/utils/status'
import { formatRelativeTime } from '@/utils/format'
import type { Conversation } from '@/types'

interface ConversationListItemProps {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
}

export function ConversationListItem({ conversation, isSelected, onSelect }: ConversationListItemProps) {
  const client = getClientById(conversation.clientId)
  const owner = getUserById(conversation.ownerId)
  const relatedDocument = conversation.relatedDocumentIds?.[0]
    ? getDocumentById(conversation.relatedDocumentIds[0])
    : undefined
  const priority = taskPriorityMeta[conversation.priority]

  return (
    <motion.button
      type="button"
      variants={staggerItem}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'group border-border-subtle focus-visible:-outline-offset-2 flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0',
        isSelected ? 'bg-primary-subtle' : 'hover:bg-surface-hover'
      )}
    >
      <span
        className={cn(
          'mt-1 h-full min-h-10 w-0.5 shrink-0 self-stretch rounded-full transition-colors',
          isSelected ? 'bg-primary' : 'bg-transparent'
        )}
      />
      <UserAvatar name={owner?.name ?? 'Unknown'} size="sm" className="mt-0.5 shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-foreground truncate text-sm font-medium">{conversation.title}</p>
          <span className="text-foreground-tertiary shrink-0 text-[11px] tabular-nums">
            {formatRelativeTime(conversation.lastActivityAt)}
          </span>
        </div>

        <p className="text-foreground-tertiary truncate text-xs">{client?.name}</p>

        {relatedDocument && (
          <div className="text-foreground-tertiary mt-1 flex items-center gap-1 text-[11px]">
            <FileText className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{relatedDocument.name}</span>
          </div>
        )}

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className={cn('size-1.5 shrink-0 rounded-full', priorityDotClass[conversation.priority])} />
          <span className="text-foreground-tertiary text-[11px]">{priority.label} priority</span>
          {conversation.isBlocking && (
            <AlertOctagon className="text-danger size-3" aria-hidden="true" aria-label="Blocking" />
          )}
          {conversation.unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground ml-auto flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}

const priorityDotClass: Record<Conversation['priority'], string> = {
  low: 'bg-foreground-tertiary',
  medium: 'bg-primary',
  high: 'bg-warning',
  urgent: 'bg-danger',
}
