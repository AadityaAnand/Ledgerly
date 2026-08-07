import { MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { EmptyState } from '@/components/shared/empty-state'
import { UserAvatar } from '@/components/shared/user-avatar'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { getUserById } from '@/mock/users'
import { getMessagesByConversationId } from '@/mock/conversation-messages'
import { formatRelativeTime } from '@/utils/format'
import type { Conversation } from '@/types'

interface MessagesTeaserProps {
  conversations: Conversation[]
}

export function MessagesTeaser({ conversations }: MessagesTeaserProps) {
  const navigate = useNavigate()

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No messages yet"
        description="When your CPA has a question or update, it’ll show up here."
        className="py-10"
      />
    )
  }

  return (
    <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
      {conversations.slice(0, 3).map((conversation) => {
        const owner = getUserById(conversation.ownerId)
        const lastClientMessage = getMessagesByConversationId(conversation.id)
          .filter((m) => m.visibility === 'client' && m.body)
          .at(-1)

        return (
          <motion.li key={conversation.id} variants={staggerItem}>
            <button
              type="button"
              onClick={() =>
                void navigate({ to: '/messages/$conversationId', params: { conversationId: conversation.id } })
              }
              className="border-border-subtle hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors"
            >
              <UserAvatar name={owner?.name ?? 'CPA'} size="sm" className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">{conversation.title}</p>
                {lastClientMessage && (
                  <p className="text-foreground-tertiary mt-0.5 truncate text-xs">{lastClientMessage.body}</p>
                )}
              </div>
              <span className="text-foreground-tertiary shrink-0 text-[11px] tabular-nums">
                {formatRelativeTime(conversation.lastActivityAt)}
              </span>
            </button>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
