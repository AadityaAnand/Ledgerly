import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { FileQuestion } from 'lucide-react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { PropertyList, type PropertyItem } from '@/components/shared/property-list'
import { AIBadge } from '@/components/shared/ai-badge'
import { fadeIn } from '@/lib/animations'
import { getWorkspaceObject, getRelatedBundle } from '@/lib/object-graph'
import { getDocumentById } from '@/mock/documents'
import { getTaskById } from '@/mock/tasks'
import { getUserById } from '@/mock/users'
import { getClientById } from '@/mock/clients'
import { getReturnsByClientId } from '@/mock/returns'
import { useNavigationStore } from '@/store/navigation-store'
import { RelationshipPanel } from '@/features/workspace/components/relationship-panel'
import { workspaceTypeMeta } from '@/features/workspace/workspace-type-meta'
import { formatDate, formatFileSize, formatRelativeTime } from '@/utils/format'
import { taskPriorityMeta } from '@/utils/status'
import type { WorkspaceObjectType } from '@/types'

export function WorkspacePage() {
  const { type, id } = useParams({ strict: false }) as { type?: WorkspaceObjectType; id?: string }
  const navigate = useNavigate()
  const visit = useNavigationStore((s) => s.visit)

  const summary = type && id ? getWorkspaceObject(type, id) : undefined
  const bundle = useMemo(() => (summary ? getRelatedBundle(summary) : undefined), [summary])

  useEffect(() => {
    if (!summary) return
    visit(
      { type: summary.type, id: summary.id, label: summary.title, href: `/workspace/${summary.type}/${summary.id}` },
      {
        returnId: summary.returnId,
        clientId: summary.clientId,
        documentId: summary.type === 'document' ? summary.id : undefined,
        taskId: summary.type === 'task' ? summary.id : undefined,
        status: summary.status?.label,
      }
    )
    // visit is a stable zustand action reference; only re-run when the object identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary?.type, summary?.id])

  if (!type || !id || !summary || !bundle) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <EmptyState
          icon={FileQuestion}
          title="Not found"
          description="This item doesn’t exist in this preview build."
        />
      </div>
    )
  }

  const meta = workspaceTypeMeta[summary.type]
  const owner = summary.ownerId ? getUserById(summary.ownerId) : undefined

  const extraProperties: PropertyItem[] = []
  if (summary.type === 'document') {
    const doc = getDocumentById(summary.id)
    if (doc) {
      extraProperties.push(
        { label: 'Category', value: doc.category.toUpperCase() },
        { label: 'File', value: `${doc.fileType.toUpperCase()} · ${formatFileSize(doc.fileSize)}` },
        { label: 'Uploaded', value: formatRelativeTime(doc.uploadedAt) },
        { label: 'AI extracted', value: doc.aiExtracted ? <AIBadge label="Extracted" /> : 'No' }
      )
    }
  } else if (summary.type === 'task') {
    const task = getTaskById(summary.id)
    if (task) {
      extraProperties.push(
        { label: 'Priority', value: <StatusBadge {...taskPriorityMeta[task.priority]} /> },
        { label: 'Assignee', value: owner?.name ?? '—' },
        { label: 'Due', value: task.dueDate ? formatDate(task.dueDate) : '—' }
      )
    }
  } else if (summary.type === 'client') {
    const client = getClientById(summary.id)
    const returns = client ? getReturnsByClientId(client.id) : []
    extraProperties.push(
      { label: 'Type', value: client?.type === 'business' ? 'Business' : 'Individual' },
      { label: 'Returns on file', value: String(returns.length) },
      { label: 'Client since', value: client ? formatDate(client.createdAt) : '—' }
    )
  } else if (summary.type === 'ai_review') {
    extraProperties.push({ label: 'Category', value: bundle.taxReturn ? bundle.taxReturn.formType : '—' })
  } else if (summary.type === 'question') {
    extraProperties.push({ label: 'Return', value: bundle.taxReturn ? `${bundle.taxReturn.taxYear} ${bundle.taxReturn.formType}` : '—' })
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-full">
        <AnimatePresence mode="wait">
          <motion.div key={`${type}-${id}`} variants={fadeIn} initial="hidden" animate="visible" className="h-full">
            <ResizablePanelGroup orientation="horizontal" className="h-full">
              <ResizablePanel defaultSize="66" minSize="45">
                <ScrollArea className="h-full">
                  <div className="mx-auto flex max-w-2xl flex-col gap-6 px-8 py-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-subtle text-primary-subtle-foreground flex size-11 shrink-0 items-center justify-center rounded-xl">
                        <meta.icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">
                          {meta.label}
                        </p>
                        <h1 className="text-foreground mt-1 text-xl font-semibold tracking-tight text-balance">
                          {summary.title}
                        </h1>
                        {summary.subtitle && (
                          <p className="text-foreground-secondary mt-1.5 text-sm leading-relaxed">{summary.subtitle}</p>
                        )}
                      </div>
                      {summary.status && <StatusBadge {...summary.status} />}
                    </div>

                    {owner && (
                      <div className="border-border-subtle flex items-center gap-2.5 rounded-lg border px-3 py-2.5">
                        <UserAvatar name={owner.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-foreground text-sm font-medium">{owner.name}</p>
                          <p className="text-foreground-tertiary text-xs">{owner.title}</p>
                        </div>
                      </div>
                    )}

                    {extraProperties.length > 0 && (
                      <div className="border-border-subtle rounded-xl border px-4">
                        <PropertyList items={extraProperties} />
                      </div>
                    )}

                    {summary.type === 'client' && bundle.client && (
                      <div className="flex flex-col gap-2">
                        <p className="text-foreground-tertiary text-xs font-semibold tracking-wide uppercase">
                          Returns
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          {getReturnsByClientId(bundle.client.id).map((r) => (
                            <li key={r.id}>
                              <button
                                type="button"
                                onClick={() => void navigate({ to: '/returns/$returnId', params: { returnId: r.id } })}
                                className="border-border-subtle hover:bg-surface-hover focus-visible:-outline-offset-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors"
                              >
                                <span className="text-foreground">
                                  {r.taxYear} {r.formType}
                                </span>
                                <span className="text-foreground-tertiary text-xs">{r.status.replace(/_/g, ' ')}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="34" minSize="26" maxSize="42">
                <RelationshipPanel summary={summary} bundle={bundle} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
