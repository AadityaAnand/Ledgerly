import { CheckCircle2, Clock, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { staggerItem } from '@/lib/animations'
import { useCollaborationStore } from '@/store/collaboration-store'
import { getUserById } from '@/mock/users'
import { documentRequestStatusMeta } from '@/utils/status'
import { formatDate } from '@/utils/format'
import type { ConversationMessage } from '@/types'

interface DocumentRequestCardProps {
  message: ConversationMessage
}

export function DocumentRequestCard({ message }: DocumentRequestCardProps) {
  const request = message.documentRequest
  const markRequestReceived = useCollaborationStore((s) => s.markRequestReceived)
  const sendReminder = useCollaborationStore((s) => s.sendReminder)

  if (!request) return null

  const requestedBy = getUserById(request.requestedById)
  const isReceived = request.status === 'received'
  const isOverdue = request.status === 'overdue'

  return (
    <motion.div
      variants={staggerItem}
      className="border-border-subtle bg-surface-raised mx-1 my-2 overflow-hidden rounded-xl border shadow-xs"
    >
      <div className="border-border-subtle flex items-center gap-2 border-b px-4 py-2.5">
        <FileText className="text-foreground-tertiary size-4" aria-hidden="true" />
        <p className="text-foreground-tertiary text-[11px] font-semibold tracking-wide uppercase">
          Document Request
        </p>
      </div>
      <div className="flex flex-col gap-3 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-foreground text-sm font-semibold">{request.documentName}</p>
          <StatusBadge {...documentRequestStatusMeta[request.status]} />
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          {requestedBy && (
            <div className="flex items-center gap-1.5">
              <UserAvatar name={requestedBy.name} size="sm" className="size-5" />
              <span className="text-foreground-secondary">Requested by {requestedBy.name}</span>
            </div>
          )}
          <div className={isOverdue ? 'text-danger flex items-center gap-1 font-medium' : 'text-foreground-tertiary flex items-center gap-1'}>
            <Clock className="size-3.5" aria-hidden="true" />
            Due {formatDate(request.dueDate, { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {isReceived ? (
          <div className="text-success flex items-center gap-1.5 text-xs font-medium">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Received
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 flex-1 text-xs"
              onClick={() => toast('Request preview isn’t available yet.')}
            >
              View Request
            </Button>
            <Button
              size="sm"
              className="h-7 flex-1 text-xs"
              onClick={() => {
                markRequestReceived(message.id)
                toast.success(`${request.documentName} marked as received`)
              }}
            >
              Mark Received
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 flex-1 text-xs"
              onClick={() => {
                sendReminder(message.id)
                toast(`Reminder sent for ${request.documentName}`)
              }}
            >
              Send Reminder
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
