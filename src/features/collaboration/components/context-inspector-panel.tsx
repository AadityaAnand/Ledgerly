import { useNavigate } from '@tanstack/react-router'
import { ChevronRight, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { InspectorPanel } from '@/components/shared/inspector-panel'
import { EmptyState } from '@/components/shared/empty-state'
import { PropertyList } from '@/components/shared/property-list'
import { StatusBadge } from '@/components/shared/status-badge'
import { ConfidenceMeter } from '@/components/shared/confidence-meter'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Timeline } from '@/components/shared/timeline'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { getUserById } from '@/mock/users'
import { getDocumentById } from '@/mock/documents'
import { getTraceById } from '@/mock/field-traces'
import { getTaskById } from '@/mock/tasks'
import { useCollaborationStore } from '@/store/collaboration-store'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'
import { returnStatusMeta, taskPriorityMeta, taskStatusMeta, verificationStatusMeta } from '@/utils/status'
import { formatDate } from '@/utils/format'
import { DocumentRequestCard } from './document-request-card'
import { MessagesSquare } from 'lucide-react'

export function ContextInspectorPanel() {
  const navigate = useNavigate()
  const conversations = useCollaborationStore((s) => s.conversations)
  const messages = useCollaborationStore((s) => s.messages)
  const selectedConversationId = useCollaborationStore((s) => s.selectedConversationId)

  const conversation = conversations.find((c) => c.id === selectedConversationId)

  if (!conversation) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="No conversation selected"
        description="Related return, documents, tasks, and activity will appear here."
        className="h-full"
      />
    )
  }

  const client = getClientById(conversation.clientId)
  const taxReturn = conversation.returnId ? getReturnById(conversation.returnId) : undefined
  const owner = getUserById(conversation.ownerId)
  const linkedDocuments = (conversation.relatedDocumentIds ?? []).map(getDocumentById).filter(Boolean)
  const relatedFields = (conversation.relatedFieldIds ?? []).map(getTraceById).filter(Boolean)
  const linkedTasks = (conversation.linkedTaskIds ?? []).map(getTaskById).filter(Boolean)
  const threadMessages = messages.filter((m) => m.conversationId === conversation.id)
  const openRequests = threadMessages.filter(
    (m) => m.kind === 'document_request' && m.documentRequest && m.documentRequest.status !== 'received'
  )
  const activityItems = threadMessages
    .filter((m) => m.kind === 'system')
    .slice(-6)
    .map((m) => ({
      id: m.id,
      actorName: 'Ledgerly',
      action: m.body,
      timestamp: m.createdAt,
    }))

  return (
    <InspectorPanel title="Context" subtitle={client?.name}>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
        <motion.div variants={staggerItem}>
          <PropertyList
            items={[
              {
                label: 'Assigned to',
                value: owner ? (
                  <span className="flex items-center justify-end gap-1.5">
                    <UserAvatar name={owner.name} size="sm" className="size-5" />
                    {owner.name}
                  </span>
                ) : (
                  '—'
                ),
              },
              { label: 'Next action', value: conversation.nextAction },
              {
                label: 'Due',
                value: conversation.dueDate ? formatDate(conversation.dueDate, { month: 'short', day: 'numeric' }) : '—',
              },
              {
                label: 'Review status',
                value: conversation.reviewStatus ? (
                  <StatusBadge
                    label={
                      conversation.reviewStatus === 'approved'
                        ? 'Approved'
                        : conversation.reviewStatus === 'in_review'
                          ? 'In review'
                          : 'Pending'
                    }
                    tone={
                      conversation.reviewStatus === 'approved'
                        ? 'success'
                        : conversation.reviewStatus === 'in_review'
                          ? 'ai'
                          : 'warning'
                    }
                  />
                ) : (
                  '—'
                ),
              },
            ]}
          />
        </motion.div>

        {taxReturn && client && (
          <motion.div variants={staggerItem}>
            <p className="text-foreground-tertiary mb-2 text-[10px] font-semibold tracking-wide uppercase">
              Related Return
            </p>
            <button
              type="button"
              onClick={() => void navigate({ to: '/returns/$returnId', params: { returnId: taxReturn.id } })}
              className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors"
            >
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-medium">
                  {client.name} — {taxReturn.formType}
                </p>
                <div className="mt-1">
                  <StatusBadge {...returnStatusMeta[taxReturn.status]} />
                </div>
              </div>
              <ChevronRight className="text-foreground-tertiary size-4 shrink-0" aria-hidden="true" />
            </button>
          </motion.div>
        )}

        {linkedDocuments.length > 0 && (
          <motion.div variants={staggerItem}>
            <p className="text-foreground-tertiary mb-2 text-[10px] font-semibold tracking-wide uppercase">
              Linked Documents
            </p>
            <ul className="flex flex-col gap-1.5">
              {linkedDocuments.map((doc) => (
                <li key={doc!.id} className="border-border-subtle flex items-center gap-2 rounded-lg border px-3 py-2">
                  <FileText className="text-foreground-tertiary size-3.5 shrink-0" aria-hidden="true" />
                  <span className="text-foreground-secondary truncate text-xs">{doc!.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {relatedFields.length > 0 && (
          <motion.div variants={staggerItem}>
            <p className="text-foreground-tertiary mb-2 text-[10px] font-semibold tracking-wide uppercase">
              Related Tax Fields
            </p>
            <ul className="flex flex-col gap-1.5">
              {relatedFields.map((field) => (
                <li key={field!.id}>
                  <button
                    type="button"
                    onClick={() =>
                      conversation.returnId &&
                      void navigate({ to: '/returns/$returnId', params: { returnId: conversation.returnId } })
                    }
                    className="border-border-subtle bg-surface-raised hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-xs font-medium">{field!.label}</p>
                      <p className="text-foreground-tertiary truncate text-[11px]">{field!.formLine}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <ConfidenceMeter score={field!.confidence} size="sm" />
                      <StatusBadge {...verificationStatusMeta[field!.verification]} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {openRequests.length > 0 && (
          <motion.div variants={staggerItem}>
            <p className="text-foreground-tertiary mb-2 text-[10px] font-semibold tracking-wide uppercase">
              Open Requests
            </p>
            <div className="-mx-1">
              {openRequests.map((message) => (
                <DocumentRequestCard key={message.id} message={message} />
              ))}
            </div>
          </motion.div>
        )}

        {linkedTasks.length > 0 && (
          <motion.div variants={staggerItem}>
            <p className="text-foreground-tertiary mb-2 text-[10px] font-semibold tracking-wide uppercase">
              Linked Tasks
            </p>
            <ul className="flex flex-col gap-1.5">
              {linkedTasks.map((task) => (
                <li key={task!.id} className="border-border-subtle rounded-lg border px-3 py-2">
                  <p className="text-foreground text-xs font-medium">{task!.title}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <StatusBadge {...taskStatusMeta[task!.status]} />
                    <StatusBadge {...taskPriorityMeta[task!.priority]} />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {activityItems.length > 0 && (
          <motion.div variants={fadeInUp}>
            <p className="text-foreground-tertiary mb-3 text-[10px] font-semibold tracking-wide uppercase">
              Recent Activity
            </p>
            <Timeline items={activityItems} />
          </motion.div>
        )}
      </motion.div>
    </InspectorPanel>
  )
}
