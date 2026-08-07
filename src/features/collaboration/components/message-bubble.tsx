import { Fragment } from 'react'
import { Lock, Pin } from 'lucide-react'
import { motion } from 'framer-motion'
import { UserAvatar } from '@/components/shared/user-avatar'
import { staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { getUserById } from '@/mock/users'
import { formatRelativeTime } from '@/utils/format'
import { AttachmentChip } from './attachment-chip'
import type { ConversationMessage } from '@/types'

/** Splits the body on "@Full Name" mentions and wraps matches in a styled span. */
function renderBodyWithMentions(body: string, mentionedUserIds: string[] | undefined) {
  if (!mentionedUserIds?.length) return body

  const names = mentionedUserIds.map((id) => getUserById(id)?.name).filter((n): n is string => Boolean(n))
  if (names.length === 0) return body

  const pattern = new RegExp(`(@(?:${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')}))`, 'g')
  const parts = body.split(pattern)

  return parts.map((part, i) =>
    names.some((n) => `@${n}` === part) ? (
      <span key={i} className="text-primary font-medium">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

interface MessageBubbleProps {
  message: ConversationMessage
  replyToMessage?: ConversationMessage
}

export function MessageBubble({ message, replyToMessage }: MessageBubbleProps) {
  const author = message.authorId ? getUserById(message.authorId) : undefined
  const isInternalNote = message.kind === 'internal_note'
  const replyAuthor = replyToMessage?.authorId ? getUserById(replyToMessage.authorId) : undefined

  return (
    <motion.div variants={staggerItem} className="group flex gap-3 px-1 py-2">
      <UserAvatar name={author?.name ?? 'Unknown'} size="sm" className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-medium">{author?.name ?? 'Unknown'}</span>
          {isInternalNote && (
            <span className="text-foreground-tertiary bg-surface inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
              <Lock className="size-2.5" aria-hidden="true" />
              Internal only — not visible to client
            </span>
          )}
          <time dateTime={message.createdAt} className="text-foreground-tertiary shrink-0 text-[11px]">
            {formatRelativeTime(message.createdAt)}
          </time>
          {message.pinned && (
            <Pin className="text-foreground-tertiary size-3" aria-hidden="true" aria-label="Pinned message" />
          )}
        </div>

        <div
          className={cn(
            'mt-1 rounded-lg rounded-tl-none px-3 py-2 text-sm leading-relaxed',
            isInternalNote
              ? 'bg-surface border-border-subtle text-foreground-secondary border border-dashed'
              : 'bg-surface-raised border-border-subtle text-foreground border'
          )}
        >
          {replyToMessage && (
            <div className="border-border-strong text-foreground-tertiary mb-1.5 border-l-2 pl-2 text-xs">
              <span className="font-medium">{replyAuthor?.name ?? 'Someone'}</span>{' '}
              <span className="line-clamp-1 align-middle">{replyToMessage.body}</span>
            </div>
          )}
          <p className="whitespace-pre-wrap">{renderBodyWithMentions(message.body, message.mentionedUserIds)}</p>
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <AttachmentChip key={attachment.id} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
