import { CheckCircle2, ClipboardCheck, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { staggerItem } from '@/lib/animations'
import { getUserById } from '@/mock/users'
import { approvalStatusMeta } from '@/utils/status'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/lib/utils'
import type { ConversationMessage } from '@/types'

const statusIcon = {
  pending: ClipboardCheck,
  approved: CheckCircle2,
  rejected: XCircle,
} as const

interface ApprovalCardProps {
  message: ConversationMessage
}

export function ApprovalCard({ message }: ApprovalCardProps) {
  const status = message.approvalStatus ?? 'pending'
  const author = message.authorId ? getUserById(message.authorId) : undefined
  const Icon = statusIcon[status]

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'mx-1 my-2 flex items-start gap-3 rounded-xl border px-4 py-3',
        status === 'approved'
          ? 'border-success/30 bg-success-subtle'
          : status === 'rejected'
            ? 'border-danger/30 bg-danger-subtle'
            : 'border-warning/30 bg-warning-subtle'
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 size-4 shrink-0',
          status === 'approved' ? 'text-success' : status === 'rejected' ? 'text-danger' : 'text-warning'
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-foreground text-sm font-medium">{message.body}</p>
          <StatusBadge {...approvalStatusMeta[status]} className="shrink-0" />
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          {author && <UserAvatar name={author.name} size="sm" className="size-4" />}
          <span className="text-foreground-tertiary text-xs">
            {author?.name} · {formatRelativeTime(message.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
